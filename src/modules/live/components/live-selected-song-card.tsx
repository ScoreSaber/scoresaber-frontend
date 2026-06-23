'use client';

import { useQuery } from '@tanstack/react-query';
import { Result } from 'better-result';

import { Badge } from '@/components/ui/badge';

import { SongInfoCard } from '@/modules/songs/song-info-card';
import { api } from '@/shared/api/ApiInstance';
import type { LiveMatchRoomControllerListRoomsItem } from '@/shared/api/generated/ApiParams';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { getDifficultyLabel } from '@/shared/format/strings';
import { apiResult } from '@/shared/result/api';

type LiveSelectedSong = NonNullable<LiveMatchRoomControllerListRoomsItem['selectedSong']>;

export function LiveSelectedSongCard({ song }: { song: LiveSelectedSong }) {
   const leaderboardId = song.leaderboardId;
   const { data: leaderboard } = useQuery({
      queryKey: ['live-selected-song-leaderboard', leaderboardId],
      queryFn: async () => {
         if (!leaderboardId) return null;

         const result = await apiResult(api.leaderboard.leaderboardControllerGetLeaderboardById({ id: leaderboardId }));
         if (Result.isError(result)) return null;

         return result.value.data;
      },
      enabled: leaderboardId != null,
      staleTime: 5 * 60 * 1000
   });

   if (leaderboard) {
      return (
         <SongInfoCard
            mapId={leaderboard.map.id}
            leaderboardId={leaderboard.id}
            songName={leaderboard.map.songName}
            songAuthorName={leaderboard.map.songAuthorName}
            levelAuthorName={leaderboard.map.levelAuthorName}
            coverImage={leaderboard.map.coverUrl}
            createdDate={leaderboard.createdAt}
            difficultyValue={leaderboard.difficulty.difficulty}
            difficultyName={getDifficultyLabel(leaderboard.difficulty.difficulty)}
            starValue={leaderboard.realm.stars > 0 ? leaderboard.realm.stars : undefined}
            showCreatedDate={false}
         />
      );
   }

   return (
      <div className="flex min-w-0 items-center gap-3">
         {song.coverUrl ? (
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md outline outline-1 outline-black/10 dark:outline-white/10">
               <FadeInImage src={song.coverUrl} alt={song.songName} fill className="object-cover" sizes="48px" />
            </div>
         ) : null}
         <div className="flex min-w-0 flex-1 flex-col">
            <div className="truncate font-semibold">{song.songName}</div>
            <div className="text-muted-foreground truncate text-sm">
               {song.songAuthorName || '-'} / {song.levelAuthorName || '-'}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
               <Badge variant="outline">{song.difficulty}</Badge>
               <Badge variant="secondary">{song.characteristic}</Badge>
            </div>
         </div>
      </div>
   );
}
