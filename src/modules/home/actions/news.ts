export type HomeNewsSource = 'patreon' | 'x' | 'youtube';

export type HomeNewsImage = {
   url: string;
   alt?: string;
};

export type HomeNewsVideo = {
   playbackUrl?: string;
   posterUrl?: string;
};

export type HomeNewsQuotedPost = {
   id: string;
   sourceLabel: string;
   sourceHref: string;
   body: string;
   href: string;
   publishedAt: string;
   images?: HomeNewsImage[];
   video?: HomeNewsVideo;
};

export type HomeNewsPost = {
   id: string;
   source: HomeNewsSource;
   sourceLabel: string;
   // account/channel page; the source label links here instead of the post
   sourceHref?: string;
   repostedBy?: {
      label: string;
      href: string;
   };
   // x posts have no title, the body is the whole post
   title?: string;
   body: string;
   href: string;
   publishedAt: string;
   images?: HomeNewsImage[];
   video?: HomeNewsVideo;
   quotedPost?: HomeNewsQuotedPost;
};

export type HomeRankedBatchVideo = {
   id: string;
   title: string;
   body: string;
   href: string;
   publishedAt: string;
   imageUrl?: string;
   // wiki page for the batch's reweights, derived from the month in the title
   reweightsHref?: string;
};

export type HomeNewsFeed = {
   posts: HomeNewsPost[];
   latestRankedBatchVideo: HomeRankedBatchVideo | null;
   generatedAt: string;
};
