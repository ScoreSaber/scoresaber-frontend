import '@tanstack/react-start/server-only';

import { Result, TaggedError } from 'better-result';
import sanitizeHtml from 'sanitize-html';

import type { HomeNewsFeed, HomeNewsPost, HomeNewsSource, HomeRankedBatchVideo } from './news';

import { env } from '@/env';

const NEWS_FEED_POST_LIMIT = 15;
const FEED_CACHE_MS = 10 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;
const POST_BODY_LENGTH = 500;
const YOUTUBE_POST_BODY_WORD_LIMIT = 22;
const SHORT_URL_TIMEOUT_MS = 4_000;

type SocialSource = HomeNewsSource | 'url';

class HomeNewsFetchError extends TaggedError('HomeNewsFetchError')<{
   source: SocialSource;
   message: string;
   cause: unknown;
}>() {}

// external api response shapes, typed at the http boundary
type PatreonPost = {
   id: string;
   attributes: {
      title?: string;
      content?: string;
      published_at?: string;
      url?: string;
      is_public?: boolean;
   };
};

type PatreonPostsResponse = {
   data?: PatreonPost[];
   links?: {
      next?: string;
   };
};

type XTweet = {
   id: string;
   text: string;
   created_at?: string;
   conversation_id?: string;
   attachments?: {
      media_keys?: string[];
   };
   entities?: {
      urls?: {
         url: string;
         expanded_url?: string;
         unwound_url?: string;
         // present when the t.co link points at the tweet's own media
         media_key?: string;
      }[];
   };
};

type XMedia = {
   media_key: string;
   type: 'photo' | 'video' | 'animated_gif';
   url?: string;
};

type YouTubeThumbnails = Partial<Record<'default' | 'medium' | 'high' | 'standard' | 'maxres', { url: string }>>;

type YouTubeSearchItem = {
   id: {
      videoId?: string;
   };
   snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails?: YouTubeThumbnails;
   };
};

type YouTubeVideo = {
   id: string;
   title: string;
   description: string;
   publishedAt: string;
   imageUrl?: string;
};

// x posts carry their linked urls until duplicate filtering, then only the post is published
type XPost = {
   post: HomeNewsPost;
   linkedUrls: string[];
};

let cachedFeed: { expiresAt: number; feed: HomeNewsFeed } | null = null;

export async function getHomeNewsFeed() {
   const now = Date.now();
   if (cachedFeed && cachedFeed.expiresAt > now) return cachedFeed.feed;

   const feed = await loadHomeNewsFeed();
   cachedFeed = {
      expiresAt: now + FEED_CACHE_MS,
      feed
   };

   return feed;
}

async function loadHomeNewsFeed(): Promise<HomeNewsFeed> {
   const [patreonPosts, youtubeVideos, xPosts] = await Promise.all([
      fetchOptional('patreon', fetchPatreonPosts, []),
      fetchOptional('youtube', fetchYouTubeVideos, []),
      fetchOptional('x', fetchXPosts, [])
   ]);
   const latestRankedBatchVideo = await findLatestRankedBatchVideo(youtubeVideos);
   const filteredXPosts = await removeDuplicateXPosts(xPosts, latestRankedBatchVideo);
   const posts = [...patreonPosts, ...youtubeVideos.map(toYouTubePost), ...filteredXPosts]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, NEWS_FEED_POST_LIMIT);

   return {
      posts,
      latestRankedBatchVideo,
      generatedAt: new Date().toISOString()
   };
}

async function fetchOptional<T>(source: SocialSource, load: () => Promise<T>, fallback: T) {
   const result = await Result.tryPromise({
      try: load,
      catch: (cause) =>
         new HomeNewsFetchError({
            source,
            message: `failed to load ${source} feed`,
            cause
         })
   });

   return Result.unwrapOr(result, fallback);
}

async function fetchPatreonPosts(): Promise<HomeNewsPost[]> {
   if (!env.HOME_NEWS_PATREON_ACCESS_TOKEN || !env.HOME_NEWS_PATREON_CAMPAIGN_ID) return [];

   const url = new URL(`https://www.patreon.com/api/oauth2/v2/campaigns/${env.HOME_NEWS_PATREON_CAMPAIGN_ID}/posts`);
   url.searchParams.set('fields[post]', 'title,content,published_at,url,is_public');
   url.searchParams.set('page[count]', String(NEWS_FEED_POST_LIMIT));

   const posts: PatreonPost[] = [];
   let nextUrl: URL | null = url;
   while (nextUrl) {
      const response: PatreonPostsResponse = await fetchJson<PatreonPostsResponse>('patreon', nextUrl, {
         headers: patreonHeaders()
      });

      posts.push(...(response.data ?? []));
      const next = response.links?.next;
      nextUrl = next ? new URL(next) : null;
   }

   return posts
      .filter((post) => post.attributes.is_public)
      .sort((a, b) => Date.parse(b.attributes.published_at ?? '') - Date.parse(a.attributes.published_at ?? ''))
      .map((post) => ({
         id: `patreon:${post.id}`,
         source: 'patreon',
         sourceLabel: 'Patreon',
         title: post.attributes.title ?? 'Patreon post',
         body: excerpt(htmlToText(post.attributes.content ?? ''), POST_BODY_LENGTH),
         href: patreonPostUrl(post),
         publishedAt: post.attributes.published_at ?? new Date(0).toISOString()
      }));
}

async function fetchXPosts(): Promise<XPost[]> {
   if (!env.HOME_NEWS_X_BEARER_TOKEN) return [];

   const userId = await fetchXUserId();
   const url = new URL(`https://api.x.com/2/users/${userId}/tweets`);
   url.searchParams.set('max_results', String(NEWS_FEED_POST_LIMIT));
   url.searchParams.set('tweet.fields', 'created_at,entities,conversation_id');
   url.searchParams.set('expansions', 'attachments.media_keys');
   url.searchParams.set('media.fields', 'url,type');
   url.searchParams.set('exclude', 'retweets,replies');

   const response = await fetchJson<{ data?: XTweet[]; includes?: { media?: XMedia[] } }>('x', url, {
      headers: xHeaders()
   });
   const mediaByKey = new Map((response.includes?.media ?? []).map((media) => [media.media_key, media]));

   return (response.data ?? []).flatMap((tweet) => {
      // exclude=replies keeps self-replies, so drop thread continuations ourselves
      if (tweet.conversation_id && tweet.conversation_id !== tweet.id) return [];

      const text = tweetText(tweet);
      const media = (tweet.attachments?.media_keys ?? []).map((key) => mediaByKey.get(key)).filter((item) => item != null);
      const imageUrls = media.filter((item) => item.type === 'photo' && item.url != null).map((item) => item.url as string);
      // nothing renderable, e.g. a video-only tweet
      if (!text && imageUrls.length === 0) return [];

      return [
         {
            post: {
               id: `x:${tweet.id}`,
               source: 'x' as const,
               sourceLabel: `@${env.HOME_NEWS_X_USERNAME}`,
               sourceHref: `https://x.com/${env.HOME_NEWS_X_USERNAME}`,
               body: excerpt(text, POST_BODY_LENGTH),
               href: `https://x.com/${env.HOME_NEWS_X_USERNAME}/status/${tweet.id}`,
               publishedAt: tweet.created_at ?? new Date(0).toISOString(),
               imageUrls
            },
            linkedUrls: tweetLinkedUrls(tweet)
         }
      ];
   });
}

async function fetchXUserId() {
   const url = new URL(`https://api.x.com/2/users/by/username/${env.HOME_NEWS_X_USERNAME}`);
   const response = await fetchJson<{ data: { id: string } }>('x', url, {
      headers: xHeaders()
   });

   return response.data.id;
}

async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
   if (!env.HOME_NEWS_YOUTUBE_API_KEY) return [];

   const channelId = await fetchYouTubeChannelId();
   const url = new URL('https://www.googleapis.com/youtube/v3/search');
   url.searchParams.set('key', env.HOME_NEWS_YOUTUBE_API_KEY);
   url.searchParams.set('part', 'snippet');
   url.searchParams.set('channelId', channelId);
   url.searchParams.set('type', 'video');
   url.searchParams.set('order', 'date');
   url.searchParams.set('maxResults', String(NEWS_FEED_POST_LIMIT));

   const response = await fetchJson<{ items?: YouTubeSearchItem[] }>('youtube', url);

   return (response.items ?? [])
      .map((item) => {
         const id = item.id.videoId;
         if (!id || item.snippet.title === 'Private video' || item.snippet.title === 'Deleted video') return null;

         return {
            id,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: item.snippet.publishedAt,
            imageUrl: getBestYouTubeThumbnail(item.snippet.thumbnails)
         };
      })
      .filter((video) => video != null);
}

async function fetchYouTubeChannelId() {
   const url = new URL('https://www.googleapis.com/youtube/v3/channels');
   url.searchParams.set('key', env.HOME_NEWS_YOUTUBE_API_KEY ?? '');
   url.searchParams.set('part', 'id');
   url.searchParams.set('forHandle', env.HOME_NEWS_YOUTUBE_HANDLE);

   const response = await fetchJson<{ items?: { id: string }[] }>('youtube', url);
   const channelId = response.items?.[0]?.id;
   if (!channelId) throw new Error('youtube channel not found');

   return channelId;
}

// drop tweets that only relay content the feed already shows: patreon posts or the ranked batch video
async function removeDuplicateXPosts(posts: XPost[], latestRankedBatchVideo: HomeRankedBatchVideo | null) {
   const withResolvedUrls = await Promise.all(
      posts.map(async ({ post, linkedUrls }) => ({
         post,
         urls: await Promise.all(linkedUrls.map(resolveShortUrl))
      }))
   );

   return withResolvedUrls
      .filter(({ urls }) => {
         if (urls.some(isPatreonPostUrl)) return false;
         return !latestRankedBatchVideo || !urls.some((url) => getYouTubeVideoId(url) === latestRankedBatchVideo.id);
      })
      .map(({ post }) => post);
}

async function resolveShortUrl(value: string) {
   if (!isTwitterShortUrl(value)) return value;

   const result = await Result.tryPromise({
      try: async () => {
         const response = await fetch(value, {
            method: 'GET',
            cache: 'no-store',
            redirect: 'follow',
            signal: AbortSignal.timeout(SHORT_URL_TIMEOUT_MS)
         });

         return response.url;
      },
      catch: (cause) =>
         new HomeNewsFetchError({
            source: 'url',
            message: 'failed to resolve short url',
            cause
         })
   });

   return Result.unwrapOr(result, value);
}

async function fetchJson<T>(source: SocialSource, url: URL, init?: RequestInit) {
   const response = await fetch(url, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
   });

   if (!response.ok) {
      throw new HomeNewsFetchError({
         source,
         message: `${source} request failed (${response.status})`,
         cause: {
            url: url.toString(),
            status: response.status,
            statusText: response.statusText
         }
      });
   }

   return response.json() as Promise<T>;
}

function xHeaders() {
   return {
      Authorization: `Bearer ${env.HOME_NEWS_X_BEARER_TOKEN}`
   };
}

function patreonHeaders() {
   return {
      Authorization: `Bearer ${env.HOME_NEWS_PATREON_ACCESS_TOKEN}`,
      'User-Agent': 'ScoreSaber Website - Home News Feed'
   };
}

function toYouTubePost(video: YouTubeVideo): HomeNewsPost {
   return {
      id: `youtube:${video.id}`,
      source: 'youtube',
      sourceLabel: env.HOME_NEWS_YOUTUBE_HANDLE,
      sourceHref: `https://www.youtube.com/${env.HOME_NEWS_YOUTUBE_HANDLE}`,
      title: video.title,
      body: wordExcerpt(video.description, YOUTUBE_POST_BODY_WORD_LIMIT),
      href: youtubeWatchUrl(video.id),
      publishedAt: video.publishedAt
   };
}

async function findLatestRankedBatchVideo(videos: YouTubeVideo[]): Promise<HomeRankedBatchVideo | null> {
   const video = videos.find(isRankedBatchVideo);
   if (!video) return null;

   return {
      id: video.id,
      title: video.title,
      body: excerpt(video.description, 320),
      href: youtubeWatchUrl(video.id),
      publishedAt: video.publishedAt,
      imageUrl: (await fetchMaxResThumbnail(video.id)) ?? video.imageUrl,
      reweightsHref: rankedBatchReweightsHref(video)
   };
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// reweight wiki pages are keyed by the batch month, e.g. .../reweights/2026/May-2026
function rankedBatchReweightsHref(video: YouTubeVideo) {
   const month = MONTH_NAMES.find((name) => new RegExp(`\\b${name}\\b`, 'i').test(video.title));
   if (!month) return undefined;

   const year = video.title.match(/\b20\d{2}\b/)?.[0] ?? String(new Date(video.publishedAt).getFullYear());
   return `https://wiki.scoresaber.com/ranking/reweights/${year}/${month}-${year}`;
}

// the search api only returns letterboxed 4:3 thumbnails; the 16:9 maxres
// variant only exists for some videos, so probe before using it
async function fetchMaxResThumbnail(videoId: string) {
   const url = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
   const result = await Result.tryPromise({
      try: async () => {
         const response = await fetch(url, {
            method: 'HEAD',
            cache: 'no-store',
            signal: AbortSignal.timeout(SHORT_URL_TIMEOUT_MS)
         });

         return response.ok ? url : null;
      },
      catch: (cause) =>
         new HomeNewsFetchError({
            source: 'youtube',
            message: 'failed to probe maxres thumbnail',
            cause
         })
   });

   return Result.unwrapOr(result, null);
}

function isRankedBatchVideo(video: YouTubeVideo) {
   return /\b(?:ranked\s+(?:maps?\s+)?batch|ranking\s+batch|batch\s+overview)\b/i.test(`${video.title}\n${video.description}`);
}

function tweetLinkedUrls(tweet: XTweet) {
   return tweet.entities?.urls?.flatMap((url) => [url.unwound_url, url.expanded_url, url.url].filter((value) => value != null)) ?? [];
}

function isPatreonPostUrl(value: string) {
   const url = parseUrl(value);
   if (!url) return false;

   const host = stripWww(url.hostname);
   return (host === 'patreon.com' || host.endsWith('.patreon.com')) && url.pathname.startsWith('/posts/');
}

function patreonPostUrl(post: PatreonPost) {
   if (!post.attributes.url) return `https://www.patreon.com/posts/${post.id}`;
   return URL.canParse(post.attributes.url) ? post.attributes.url : `https://www.patreon.com${post.attributes.url}`;
}

function isTwitterShortUrl(value: string) {
   return parseUrl(value)?.hostname === 't.co';
}

function getYouTubeVideoId(value: string) {
   const url = parseUrl(value);
   if (!url) return null;

   const host = stripWww(url.hostname);
   if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] ?? null;
   if (host !== 'youtube.com' && host !== 'm.youtube.com' && host !== 'music.youtube.com') return null;
   if (url.pathname === '/watch') return url.searchParams.get('v');

   const [kind, id] = url.pathname.split('/').filter(Boolean);
   return kind === 'shorts' || kind === 'embed' || kind === 'live' ? (id ?? null) : null;
}

function parseUrl(value: string) {
   return URL.canParse(value) ? new URL(value) : null;
}

function youtubeWatchUrl(id: string) {
   return `https://www.youtube.com/watch?v=${id}`;
}

function getBestYouTubeThumbnail(thumbnails: YouTubeThumbnails | undefined) {
   return thumbnails?.maxres?.url ?? thumbnails?.standard?.url ?? thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url;
}

// expand t.co links to their real urls, drop links to the tweet's own media,
// strip leftover short links, and decode the html entities x escapes
function tweetText(tweet: XTweet) {
   let text = tweet.text;
   for (const url of tweet.entities?.urls ?? []) {
      text = text.replaceAll(url.url, url.media_key ? '' : (url.expanded_url ?? url.url));
   }

   return normalizeWhitespace(text.replace(/https:\/\/t\.co\/\w+/g, ''))
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&amp;', '&');
}

function htmlToText(value: string) {
   return normalizeWhitespace(
      sanitizeHtml(value, {
         allowedTags: [],
         allowedAttributes: {}
      })
   );
}

function normalizeWhitespace(value: string) {
   return value.replace(/\s+/g, ' ').trim();
}

function excerpt(value: string, length: number) {
   const normalized = normalizeWhitespace(value);
   if (normalized.length <= length) return normalized;
   return `${normalized.slice(0, length - 1).trimEnd()}...`;
}

function wordExcerpt(value: string, wordLimit: number) {
   const words = normalizeWhitespace(value).split(' ').filter(Boolean);
   if (words.length <= wordLimit) return words.join(' ');
   return `${words.slice(0, wordLimit).join(' ')}...`;
}

function stripWww(hostname: string) {
   return hostname.toLowerCase().replace(/^www\./, '');
}
