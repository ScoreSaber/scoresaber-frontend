import '@tanstack/react-start/server-only';

import { Result, TaggedError } from 'better-result';

import type { HomeBswcMatch, HomeBswcPromo, HomeBswcTeam } from './bswc';

const CUBE_API_BASE_URL = 'https://api.cube.community/trpc';
const CUBE_TOURNAMENT_ID = 'bswc-2026';
const CUBE_TOURNAMENT_URL = `https://cube.community/tournaments/${CUBE_TOURNAMENT_ID}`;
const CUBE_SCHEDULE_URL = `${CUBE_TOURNAMENT_URL}/schedule`;
const CUBE_TWITCH_CHANNEL = 'cubecommunity';
const CUBE_TWITCH_URL = `https://www.twitch.tv/${CUBE_TWITCH_CHANNEL}`;
const BSWC_CACHE_MS = 60 * 1000;
const BSWC_RETRY_MS = 15 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;
const DELAYED_MATCH_GRACE_MS = 2 * 60 * 60 * 1000;

class BswcFetchError extends TaggedError('BswcFetchError')<{
   procedure: string;
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

type CubeTrpcResponse<T> = {
   result?: {
      data?: {
         json?: T;
      };
   };
};

type CubeTournament = {
   name?: string;
   summary?: string | null;
   banner?: string | null;
   background?: string | null;
};

type CubeTeam = {
   name: string;
   image?: string | null;
};

type CubeMatch = {
   id: string;
   status: string;
   time: string | null;
   team1: CubeTeam | null;
   team2: CubeTeam | null;
};

type CubeLiveMatch = {
   live: boolean;
   matchId?: string | null;
};

let cachedPromo: { expiresAt: number; promo: HomeBswcPromo | null } | null = null;
let pendingRefresh: Promise<HomeBswcPromo | null> | null = null;

export async function getHomeBswcPromo() {
   if (cachedPromo && cachedPromo.expiresAt > Date.now()) return cachedPromo.promo;

   pendingRefresh ??= refreshHomeBswcPromo().finally(() => {
      pendingRefresh = null;
   });

   if (cachedPromo) {
      void pendingRefresh.catch((cause) => console.warn('[home bswc] background refresh failed', cause));
      return cachedPromo.promo;
   }

   return pendingRefresh;
}

async function refreshHomeBswcPromo() {
   const promo = await loadHomeBswcPromo();
   cachedPromo = {
      expiresAt: Date.now() + (promo ? BSWC_CACHE_MS : BSWC_RETRY_MS),
      promo
   };

   return promo;
}

async function loadHomeBswcPromo(): Promise<HomeBswcPromo | null> {
   const [tournament, matches, live] = await Promise.all([
      fetchOptional('tournaments.getTourney', () => fetchCubeTrpc<CubeTournament>('tournaments.getTourney')),
      fetchOptional('bracket.getMatches', () => fetchCubeTrpc<CubeMatch[]>('bracket.getMatches')),
      fetchOptional('bracket.getOnGoingMatch', () => fetchCubeTrpc<CubeLiveMatch>('bracket.getOnGoingMatch'))
   ]);

   if (!matches) return null;

   const now = Date.now();
   const nextMatches = matches
      .filter((match) => match.time && match.team1 && match.team2 && match.status !== 'COMPLETE')
      .map(toHomeMatch)
      .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
   const delayedMatch = findDelayedMatch(nextMatches, now);
   const futureMatch = nextMatches.find((match) => Date.parse(match.startsAt) > now) ?? null;

   const liveMatch = live?.live && live.matchId ? (matches.find((match) => match.id === live.matchId) ?? null) : null;

   return {
      name: tournament?.name ?? 'Beat Saber World Cup 2026',
      summary: withoutTrailingFullStop(tournament?.summary),
      bannerUrl: tournament?.banner ?? null,
      backgroundUrl: tournament?.background ?? null,
      infoHref: CUBE_TOURNAMENT_URL,
      scheduleHref: CUBE_SCHEDULE_URL,
      twitchHref: CUBE_TWITCH_URL,
      twitchChannel: CUBE_TWITCH_CHANNEL,
      nextMatch: delayedMatch ?? futureMatch,
      liveMatch: liveMatch && liveMatch.time && liveMatch.team1 && liveMatch.team2 ? toHomeMatch(liveMatch) : null
   };
}

async function fetchOptional<T>(procedure: string, load: () => Promise<T>) {
   const result = await Result.tryPromise({
      try: load,
      catch: (cause) =>
         new BswcFetchError({
            procedure,
            message: `${procedure} request failed`,
            status: null,
            cause
         })
   });

   return Result.match(result, {
      ok: (value) => value,
      err: (error) => {
         console.warn('[home bswc]', error.message, error.cause);
         return null;
      }
   });
}

async function fetchCubeTrpc<T>(procedure: string) {
   const url = new URL(`${CUBE_API_BASE_URL}/${procedure}`);
   url.searchParams.set('input', JSON.stringify({ json: { tournamentId: CUBE_TOURNAMENT_ID } }));

   const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
   });

   if (!response.ok) {
      throw new BswcFetchError({
         procedure,
         message: `${procedure} request failed (${response.status})`,
         status: response.status,
         cause: response.statusText
      });
   }

   const payload = (await response.json()) as CubeTrpcResponse<T>;
   const data = payload.result?.data?.json;

   if (data == null) {
      throw new BswcFetchError({
         procedure,
         message: `${procedure} response did not include data`,
         status: response.status,
         cause: payload
      });
   }

   return data;
}

function toHomeMatch(match: CubeMatch): HomeBswcMatch {
   return {
      id: match.id,
      startsAt: new Date(match.time ?? 0).toISOString(),
      team1: toHomeTeam(match.team1),
      team2: toHomeTeam(match.team2)
   };
}

function findDelayedMatch(matches: HomeBswcMatch[], now: number) {
   for (let index = matches.length - 1; index >= 0; index--) {
      const match = matches[index];
      const startsAt = Date.parse(match.startsAt);
      if (startsAt <= now && now - startsAt <= DELAYED_MATCH_GRACE_MS) return match;
   }

   return null;
}

function toHomeTeam(team: CubeTeam | null): HomeBswcTeam {
   return {
      name: team?.name ?? 'TBD',
      imageUrl: team?.image ?? null
   };
}

function withoutTrailingFullStop(text: string | null | undefined) {
   return text?.replace(/\.$/, '') ?? null;
}
