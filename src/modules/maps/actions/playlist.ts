import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { isMapIdentifierSearch } from '@/modules/maps/shared/map-search';
import {
   MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_BY,
   MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_DIRECTION,
   MAP_CONTROLLER_GET_MAP_LISTINGS_STATUS,
   type MapControllerGetMapListingsStatus
} from '@/shared/api/generated/ApiParams';
import { publicApi } from '@/shared/api/server-api';
import { actionFailure, actionSuccess } from '@/shared/result/action';

const playlistInputSchema = z.object({
   search: z.string().trim().min(1).max(64).optional(),
   status: z.string().optional(),
   verified: z.enum(['true', 'false']).optional(),
   minStars: z.number().nonnegative().optional(),
   maxStars: z.number().nonnegative().optional(),
   sortBy: z.enum(MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_BY).optional(),
   sortDirection: z.enum(MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_DIRECTION).optional(),
   limit: z.number().int().min(1).max(200).optional(),
   playlistTitle: z.string().trim().min(1).max(120).optional(),
   playlistAuthor: z.string().trim().min(1).max(120).optional(),
   playlistDescription: z.string().trim().max(300).optional()
});
const mapStatusesSchema = z
   .array(z.enum(MAP_CONTROLLER_GET_MAP_LISTINGS_STATUS).optional().catch(undefined))
   .transform((statuses) => statuses.filter((status) => status != null));

export type PlaylistInput = z.infer<typeof playlistInputSchema>;

interface BeatSaberPlaylistSong {
   key: string;
   hash: string;
   songName: string;
   levelAuthorName: string;
}

interface BeatSaberPlaylist {
   playlistTitle: string;
   playlistAuthor: string;
   playlistDescription: string;
   image: string;
   songs: BeatSaberPlaylistSong[];
}

const SCORESABER_PLAYLIST_IMAGE =
   'data:image/png;base64,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';

const MAP_LISTING_API_LIMIT = 100;

const downloadMapPlaylistFn = createServerFn({ method: 'POST' })
   .inputValidator((input: PlaylistInput) => playlistInputSchema.parse(input))
   .handler(async ({ data }) => {
      const search = data.search?.trim();
      const identifierSearch = search ? isMapIdentifierSearch(search) : false;
      const statuses = parseMapListingStatuses(data.status) ?? getImplicitRankedStatuses(data);
      const requestedLimit = data.limit ?? MAP_LISTING_API_LIMIT;
      const listingParams = {
         search: search || undefined,
         status: !identifierSearch ? statuses : undefined,
         verified: identifierSearch ? undefined : (data.verified ?? 'true'),
         minStars: identifierSearch ? undefined : data.minStars,
         maxStars: identifierSearch ? undefined : data.maxStars,
         sortBy: data.sortBy ?? 'trending',
         sortDirection: data.sortDirection ?? 'desc'
      };
      const responses = await Promise.all(
         Array.from({ length: Math.ceil(requestedLimit / MAP_LISTING_API_LIMIT) }, (_, pageIndex) =>
            publicApi.map.mapControllerGetMapListings({
               ...listingParams,
               page: pageIndex + 1,
               limit: Math.min(MAP_LISTING_API_LIMIT, requestedLimit - pageIndex * MAP_LISTING_API_LIMIT)
            })
         )
      );

      const seenKeys = new Set<string>();
      const songs = responses
         .flatMap((response) => response.data.data)
         .reduce<BeatSaberPlaylistSong[]>((result, map) => {
            if (!map.bsid || seenKeys.has(map.bsid)) return result;
            seenKeys.add(map.bsid);
            result.push({
               key: map.bsid,
               hash: map.hash,
               songName: map.songSubName ? `${map.songName} ${map.songSubName}` : map.songName,
               levelAuthorName: map.levelAuthorName
            });
            return result;
         }, []);

      if (songs.length === 0) {
         return actionFailure('No BeatSaver-linked maps found for the current filters');
      }

      const playlist: BeatSaberPlaylist = {
         playlistTitle: getMapPlaylistTitle(data),
         playlistAuthor: data.playlistAuthor ?? 'ScoreSaber',
         playlistDescription: data.playlistDescription ?? getPlaylistDescription(data, songs.length),
         image: SCORESABER_PLAYLIST_IMAGE,
         songs
      };

      return actionSuccess({
         count: songs.length,
         fileName: getPlaylistFileName(data),
         content: JSON.stringify(playlist, null, 2)
      });
   });

export async function downloadMapPlaylist(input: PlaylistInput) {
   return downloadMapPlaylistFn({ data: input });
}

function parseMapListingStatuses(status?: string) {
   const statuses = mapStatusesSchema.parse(status?.split(',').filter(Boolean) ?? []);
   return statuses.length > 0 ? statuses : undefined;
}

function getImplicitRankedStatuses(input: PlaylistInput): MapControllerGetMapListingsStatus[] | undefined {
   if (input.sortBy === 'highestStars' || input.sortBy === 'latestRankedAt' || input.minStars != null || input.maxStars != null) {
      return ['RANKED'];
   }

   return undefined;
}

export function getMapPlaylistTitle(input: PlaylistInput) {
   if (input.playlistTitle) return input.playlistTitle;
   if (input.sortBy === 'latestRankedAt') return 'ScoreSaber recent ranked maps';
   if (input.minStars != null || input.maxStars != null) {
      const min = input.minStars?.toFixed(1) ?? '0.0';
      const max = input.maxStars?.toFixed(1) ?? '16.0';
      return `ScoreSaber ${min}-${max} star maps`;
   }
   if (input.search) return `ScoreSaber maps for ${input.search}`;
   return 'ScoreSaber maps';
}

function getPlaylistDescription(input: PlaylistInput, count: number) {
   const title = getMapPlaylistTitle(input);
   return `${title} exported from scoresaber.com/maps (${count} maps)`;
}

function getPlaylistFileName(input: PlaylistInput) {
   const slug = getMapPlaylistTitle(input)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
   return `${slug || 'scoresaber-maps'}.bplist`;
}
