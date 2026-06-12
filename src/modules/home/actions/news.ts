export type HomeNewsSource = 'patreon' | 'x' | 'youtube';

export type HomeNewsPost = {
   id: string;
   source: HomeNewsSource;
   sourceLabel: string;
   // account/channel page; the source label links here instead of the post
   sourceHref?: string;
   // x posts have no title, the body is the whole post
   title?: string;
   body: string;
   href: string;
   publishedAt: string;
   imageUrls?: string[];
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
