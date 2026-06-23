'use client';

import { Fragment } from 'react';

import { Play } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { LivePlayerCell } from '@/modules/live/components/live-room-player-list';
import { LiveTableShell } from '@/modules/live/components/live-ui';
import { BeatSaverKeyPill } from '@/modules/maps/shared/beatsaver-key-pill';
import { ReplayDialog } from '@/modules/scores/replay-dialog';
import type { LiveMatchRoomControllerGetRoomViewResponse } from '@/shared/api/generated/ApiParams';
import { Time } from '@/shared/components/time';
import { formatAccuracy, formatNumber } from '@/shared/format/helpers';
import { formatEnumLabel } from '@/shared/format/strings';

type RoomFinalScore = LiveMatchRoomControllerGetRoomViewResponse['finalScores'][number];

export function LiveRoomFinalScoresTable({
   scores,
   emptyLabel,
   labels
}: {
   scores: RoomFinalScore[];
   emptyLabel: string;
   labels: {
      player: string;
      rank: string;
      score: string;
      accuracy: string;
      misses: string;
      completion: string;
      reportedAt: string;
      unknownMap: string;
      unknownPlayer: string;
   };
}) {
   const t = useTranslations();
   const groups = getFinalScoreGroups(scores, labels.unknownMap);
   const replayButtonClassName = 'h-auto w-auto cursor-default p-0 text-muted-foreground hover:bg-transparent hover:text-foreground';

   return (
      <LiveTableShell className="max-h-[64dvh] min-h-[28rem] shrink-0">
         <Table>
            <TableHeader className="bg-background/85 sticky top-0 z-10 backdrop-blur-sm">
               <TableRow>
                  <TableHead className="w-14">
                     <span className="sr-only">{labels.rank}</span>
                  </TableHead>
                  <TableHead>{labels.player}</TableHead>
                  <TableHead>{labels.score}</TableHead>
                  <TableHead>{labels.accuracy}</TableHead>
                  <TableHead>{labels.misses}</TableHead>
                  <TableHead>{labels.completion}</TableHead>
                  <TableHead>{labels.reportedAt}</TableHead>
                  <TableHead className="w-10">
                     <span className="sr-only">{t('score.watchReplay')}</span>
                  </TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {groups.length > 0 ? (
                  groups.map((group) => (
                     <Fragment key={group.key}>
                        <TableRow>
                           <TableCell colSpan={8} className="text-muted-foreground h-9 px-3 text-xs font-semibold">
                              <div className="flex min-w-0 items-center gap-2">
                                 {group.href ? (
                                    <a
                                       href={group.href}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="hover:text-primary truncate transition-colors"
                                    >
                                       {group.label}
                                    </a>
                                 ) : (
                                    <span className="truncate">{group.label}</span>
                                 )}
                                 {group.beatSaverKey ? <BeatSaverKeyPill beatSaverKey={group.beatSaverKey} variant="copy" size="xs" /> : null}
                              </div>
                           </TableCell>
                        </TableRow>
                        {group.scores.map((score, index) => (
                           <TableRow key={score.id}>
                              <TableCell className="w-14 whitespace-nowrap">#{index + 1}</TableCell>
                              <TableCell className="min-w-56">
                                 <LivePlayerCell player={score.player} unknownLabel={labels.unknownPlayer} />
                              </TableCell>
                              <TableCell>{formatNumber(score.modifiedScore ?? score.score)}</TableCell>
                              <TableCell>{score.accuracy == null ? '-' : formatAccuracy(score.accuracy * 100)}</TableCell>
                              <TableCell>{formatNumber(score.misses)}</TableCell>
                              <TableCell>{formatEnumLabel(score.fullCombo ? 'FULL_COMBO' : score.completion)}</TableCell>
                              <TableCell>
                                 <Time date={score.reportedAt} short />
                              </TableCell>
                              <TableCell className="w-10 text-right">
                                 <ReplayDialog
                                    scoreId={score.scoreId}
                                    tooltip={t('score.watchReplay')}
                                    tooltipSide="left"
                                    trigger={({ replayUrl, openReplayAction }) => (
                                       <Button variant="ghost-icon" size="icon-xs" asChild className={replayButtonClassName}>
                                          <a
                                             href={replayUrl}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             onClick={openReplayAction}
                                             aria-label={t('score.watchReplay')}
                                          >
                                             <Play data-icon />
                                          </a>
                                       </Button>
                                    )}
                                 />
                              </TableCell>
                           </TableRow>
                        ))}
                     </Fragment>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={8} className="text-muted-foreground h-16 text-center">
                        {emptyLabel}
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </LiveTableShell>
   );
}

function getFinalScoreGroups(scores: RoomFinalScore[], unknownMapLabel: string) {
   const groupsByMap = new Map<string, RoomFinalScore[]>();
   for (const score of scores) {
      const key = getFinalScoreMapKey(score);
      groupsByMap.set(key, [...(groupsByMap.get(key) ?? []), score]);
   }

   return [...groupsByMap.entries()]
      .map(([key, groupScores]) => ({
         key,
         label: getFinalScoreMapLabel(groupScores[0], unknownMapLabel),
         href: getFinalScoreMapHref(groupScores[0]),
         beatSaverKey: groupScores[0]?.song?.beatSaverKey,
         latestReportedAt: getLatestReportedAt(groupScores),
         scores: groupScores.toSorted(compareFinalScoresForMap)
      }))
      .toSorted((left, right) => right.latestReportedAt.localeCompare(left.latestReportedAt));
}

function getFinalScoreMapKey(score: RoomFinalScore) {
   if (score.song?.id != null) return `song:${score.song.id}`;
   if (score.song?.mapHash) return `hash:${score.song.mapHash}`;
   return `unknown:${score.matchId ?? score.roomId ?? 'room'}`;
}

function getFinalScoreMapLabel(score: RoomFinalScore | undefined, unknownMapLabel: string) {
   const song = score?.song;
   if (!song) return unknownMapLabel;

   return `${song.songName} (${song.difficulty} / ${song.characteristic})`;
}

function getFinalScoreMapHref(score: RoomFinalScore | undefined) {
   const leaderboardId = score?.song?.leaderboardId;
   return leaderboardId == null ? null : `/leaderboard/${leaderboardId}`;
}

function compareFinalScoresForMap(left: RoomFinalScore, right: RoomFinalScore) {
   const leftScore = left.modifiedScore ?? left.score;
   const rightScore = right.modifiedScore ?? right.score;
   if (leftScore !== rightScore) return rightScore - leftScore;

   return left.reportedAt.localeCompare(right.reportedAt);
}

function getLatestReportedAt(scores: RoomFinalScore[]) {
   return scores.reduce((latest, score) => (score.reportedAt > latest ? score.reportedAt : latest), '');
}
