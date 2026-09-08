export const BSWC_PROMO_ENABLED = false;

export type HomeBswcTeam = {
   name: string;
   imageUrl: string | null;
};

export type HomeBswcMatch = {
   id: string;
   startsAt: string;
   team1: HomeBswcTeam;
   team2: HomeBswcTeam;
};

export type HomeBswcPromo = {
   name: string;
   summary: string | null;
   bannerUrl: string | null;
   backgroundUrl: string | null;
   infoHref: string;
   scheduleHref: string;
   twitchHref: string;
   twitchChannel: string;
   nextMatch: HomeBswcMatch | null;
   liveMatch: HomeBswcMatch | null;
};
