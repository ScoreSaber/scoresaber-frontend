'use client';

import { Fragment, type ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { LiveTableShell } from '@/modules/live/components/live-ui';
import { PlayerLink } from '@/modules/player/shared/player-link';
import type { LiveTournamentRosterControllerListAuthorizedPlayersItem, LiveMatchRoomControllerListRoomsItem } from '@/shared/api/generated/ApiParams';
import { Time } from '@/shared/components/time';
import { formatAccuracy, formatNumber } from '@/shared/format/helpers';
import { formatEnumLabel } from '@/shared/format/strings';

type LiveRosterMode = LiveMatchRoomControllerListRoomsItem['rosterMode'];
export type LiveRoomMember = LiveMatchRoomControllerListRoomsItem['members'][number];
type LiveAuthorizedPlayer = LiveTournamentRosterControllerListAuthorizedPlayersItem;
type LivePlayerIdentity = NonNullable<LiveAuthorizedPlayer['player']>;
type LiveRoomPlayerDisplayPlayState = LiveRoomMember['playState'] | 'IDLE' | 'PAUSED' | 'PLAYING';
type LiveRoomPlayerReadyState = 'NOT_READY' | 'READY' | 'AFK';

export type LiveRoomPlayerListRow = {
   playerId: string;
   player: LivePlayerIdentity | null;
   teamName: string | null;
   role?: string;
   member?: LiveRoomMember | null;
   active?: boolean;
   stateLabel?: string;
   playState?: LiveRoomPlayerDisplayPlayState;
   downloadState?: LiveRoomMember['downloadState'];
   readyState?: LiveRoomPlayerReadyState;
   isBot?: boolean;
   errorMessage?: string;
   score?: {
      rank: number | null;
      score: number;
      accuracy: number | null;
      combo: number | null;
      notesMissed: number;
   } | null;
};

type LiveRoomPlayerSortMode = 'name' | 'song-rank';
type LiveRoomPlayerListGroup = {
   key: string;
   name: string | null;
   rows: {
      row: LiveRoomPlayerListRow;
      displayRank: number | null;
   }[];
};

export function LivePlayerCell({ player, unknownLabel, isBot }: { player: LivePlayerIdentity | null; unknownLabel: string; isBot?: boolean }) {
   if (player) {
      const displayPlayer = isBot ? { ...player, name: `${player.name} [BOT]` } : player;

      return (
         <div className="flex min-w-0 flex-col">
            <PlayerLink player={displayPlayer} withPFP />
         </div>
      );
   }

   return (
      <div className="flex min-w-0 flex-col">
         <span className="truncate font-medium">{formatBotName(unknownLabel, isBot)}</span>
      </div>
   );
}

export function LiveRoomPlayerList({
   rows,
   mode,
   labels,
   emptyLabel,
   maxHeightClassName = 'max-h-96',
   showState,
   showLastSeen,
   showRole,
   showParticipation,
   showAccuracy,
   showLastPromptResponse,
   showExtraInfo,
   sortMode = 'name',
   renderLastPromptResponse,
   rowAction
}: {
   rows: LiveRoomPlayerListRow[];
   mode: LiveRosterMode;
   labels: {
      player: string;
      state: string;
      lastSeen: string;
      role: string;
      participation: string;
      rank: string;
      score: string;
      accuracy: string;
      combo: string;
      misses: string;
      lastPromptResponse: string;
      actions: string;
      noTeam: string;
      unknownPlayer: string;
      connected: string;
      notConnected: string;
      active: string;
      inactive: string;
      ready: string;
      notReady: string;
      afk: string;
   };
   emptyLabel: string;
   maxHeightClassName?: string;
   showState?: boolean;
   showLastSeen?: boolean;
   showRole?: boolean;
   showParticipation?: boolean;
   showAccuracy?: boolean;
   showLastPromptResponse?: boolean;
   showExtraInfo?: boolean;
   sortMode?: LiveRoomPlayerSortMode;
   renderLastPromptResponse?: (row: LiveRoomPlayerListRow) => ReactNode;
   rowAction?: (row: LiveRoomPlayerListRow) => ReactNode;
}) {
   const groups = groupRows(rows, mode, labels.noTeam, sortMode);
   const showRank = groups.some((group) => group.rows.some((row) => row.displayRank != null));
   const colSpan =
      1 +
      Number(showRank) +
      Number(showState) +
      Number(showAccuracy) +
      (showExtraInfo ? 3 : 0) +
      Number(showRole) +
      Number(showParticipation) +
      Number(showLastPromptResponse) +
      Number(showLastSeen);

   return (
      <LiveTableShell className={maxHeightClassName}>
         <Table>
            <TableHeader className="bg-background/85 sticky top-0 z-10 backdrop-blur-sm">
               <TableRow>
                  {showRank ? (
                     <TableHead className="w-14">
                        <span className="sr-only">{labels.rank}</span>
                     </TableHead>
                  ) : null}
                  <TableHead>{labels.player}</TableHead>
                  {showState ? <TableHead>{labels.state}</TableHead> : null}
                  {showAccuracy ? <TableHead>{labels.accuracy}</TableHead> : null}
                  {showExtraInfo ? <TableHead>{labels.score}</TableHead> : null}
                  {showExtraInfo ? <TableHead>{labels.combo}</TableHead> : null}
                  {showExtraInfo ? <TableHead>{labels.misses}</TableHead> : null}
                  {showRole ? <TableHead>{labels.role}</TableHead> : null}
                  {showParticipation ? <TableHead>{labels.participation}</TableHead> : null}
                  {showLastPromptResponse ? <TableHead>{labels.lastPromptResponse}</TableHead> : null}
                  {showLastSeen ? <TableHead>{labels.lastSeen}</TableHead> : null}
               </TableRow>
            </TableHeader>
            <TableBody>
               {groups.length > 0 ? (
                  groups.map((group) => (
                     <Fragment key={group.key}>
                        {group.name ? (
                           <TableRow key={`${group.key}-group`}>
                              <TableCell colSpan={colSpan} className="text-muted-foreground h-9 px-3 text-xs font-semibold">
                                 {group.name}
                              </TableCell>
                           </TableRow>
                        ) : null}
                        {group.rows.map(({ row, displayRank }) => {
                           const action = rowAction?.(row);

                           return (
                              <TableRow key={row.playerId} className="group/row">
                                 {showRank ? (
                                    <TableCell className="w-14 whitespace-nowrap">{displayRank == null ? '-' : `#${displayRank}`}</TableCell>
                                 ) : null}
                                 <TableCell className="max-w-72 min-w-56">
                                    <div className="flex min-w-0 items-center gap-2">
                                       <div className="min-w-0 flex-1">
                                          <LivePlayerCell player={row.player} unknownLabel={labels.unknownPlayer} isBot={row.isBot} />
                                       </div>
                                       {action ? (
                                          <div className="flex shrink-0 justify-end gap-1 opacity-100 transition-opacity md:pointer-events-none md:opacity-0 md:group-hover/row:pointer-events-auto md:group-hover/row:opacity-100">
                                             {action}
                                          </div>
                                       ) : null}
                                    </div>
                                 </TableCell>
                                 {showState ? (
                                    <TableCell>
                                       {row.stateLabel ??
                                          formatConnectionState(
                                             row.member ?? null,
                                             row.playState,
                                             row.downloadState,
                                             row.readyState ?? 'NOT_READY',
                                             row.errorMessage,
                                             labels.connected,
                                             labels.notConnected,
                                             labels.ready,
                                             labels.notReady,
                                             labels.afk
                                          )}
                                    </TableCell>
                                 ) : null}
                                 {showAccuracy ? (
                                    <TableCell>{row.score?.accuracy == null ? '-' : formatAccuracy(row.score.accuracy * 100)}</TableCell>
                                 ) : null}
                                 {showExtraInfo ? <TableCell>{row.score ? formatNumber(row.score.score) : '-'}</TableCell> : null}
                                 {showExtraInfo ? <TableCell>{row.score?.combo == null ? '-' : formatNumber(row.score.combo)}</TableCell> : null}
                                 {showExtraInfo ? <TableCell>{row.score ? formatNumber(row.score.notesMissed) : '-'}</TableCell> : null}
                                 {showRole ? <TableCell>{row.role ?? '-'}</TableCell> : null}
                                 {showParticipation ? (
                                    <TableCell>
                                       <ParticipationBadge active={row.active ?? true} labels={labels} />
                                    </TableCell>
                                 ) : null}
                                 {showLastPromptResponse ? <TableCell>{renderLastPromptResponse?.(row) ?? '-'}</TableCell> : null}
                                 {showLastSeen ? <TableCell>{formatLastSeen(row.member ?? null)}</TableCell> : null}
                              </TableRow>
                           );
                        })}
                     </Fragment>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={colSpan} className="text-muted-foreground h-20 text-center">
                        {emptyLabel}
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </LiveTableShell>
   );
}

function ParticipationBadge({ active, labels }: { active: boolean; labels: { active: string; inactive: string } }) {
   return <Badge variant={active ? 'stat-success' : 'secondary'}>{active ? labels.active : labels.inactive}</Badge>;
}

function groupRows(
   rows: LiveRoomPlayerListRow[],
   mode: LiveRosterMode,
   noTeamLabel: string,
   sortMode: LiveRoomPlayerSortMode
): LiveRoomPlayerListGroup[] {
   const compareRows = sortMode === 'song-rank' ? compareRowsBySongRank : compareRowsByName;

   if (mode === 'FLAT') return [{ key: 'flat', name: null, rows: withGlobalDisplayRanks(rows.toSorted(compareRows)) }];

   const grouped = new Map<string, { key: string; name: string; rows: LiveRoomPlayerListRow[] }>();
   for (const row of rows) {
      const key = row.teamName ?? 'none';
      const group = grouped.get(key) ?? { key, name: row.teamName ?? noTeamLabel, rows: [] };
      group.rows.push(row);
      grouped.set(key, group);
   }

   return [...grouped.values()]
      .toSorted((left, right) => (left.key === 'none' ? 1 : right.key === 'none' ? -1 : left.name.localeCompare(right.name)))
      .map((group) => {
         const sortedGroupRows = group.rows.toSorted(compareRows);

         return {
            ...group,
            rows: sortMode === 'song-rank' ? withRelativeDisplayRanks(sortedGroupRows) : withGlobalDisplayRanks(sortedGroupRows)
         };
      });
}

function withGlobalDisplayRanks(rows: LiveRoomPlayerListRow[]) {
   return rows.map((row) => ({ row, displayRank: row.score?.rank ?? null }));
}

function withRelativeDisplayRanks(rows: LiveRoomPlayerListRow[]) {
   let nextRank = 1;

   return rows.map((row) => {
      const displayRank = row.score ? nextRank++ : null;
      return { row, displayRank };
   });
}

function compareRowsByName(left: LiveRoomPlayerListRow, right: LiveRoomPlayerListRow) {
   return getRowName(left).localeCompare(getRowName(right));
}

function compareRowsBySongRank(left: LiveRoomPlayerListRow, right: LiveRoomPlayerListRow) {
   const leftAccuracy = left.score?.accuracy;
   const rightAccuracy = right.score?.accuracy;
   if (leftAccuracy != null && rightAccuracy != null && leftAccuracy !== rightAccuracy) return rightAccuracy - leftAccuracy;
   if (leftAccuracy != null && rightAccuracy == null) return -1;
   if (leftAccuracy == null && rightAccuracy != null) return 1;

   const leftRank = left.score?.rank;
   const rightRank = right.score?.rank;

   if (leftRank != null && rightRank != null && leftRank !== rightRank) return leftRank - rightRank;
   if (leftRank != null && rightRank == null) return -1;
   if (leftRank == null && rightRank != null) return 1;

   const leftScore = left.score?.score;
   const rightScore = right.score?.score;
   if (leftScore != null && rightScore != null && leftScore !== rightScore) return rightScore - leftScore;
   if (leftScore != null && rightScore == null) return -1;
   if (leftScore == null && rightScore != null) return 1;
   return compareRowsByName(left, right);
}

function getRowName(row: LiveRoomPlayerListRow) {
   return row.player?.name ?? 'Player';
}

function formatBotName(name: string, isBot: boolean | undefined) {
   return isBot ? `${name} [BOT]` : name;
}

function formatConnectionState(
   member: LiveRoomMember | null,
   playState: LiveRoomPlayerDisplayPlayState | undefined,
   downloadState: LiveRoomMember['downloadState'] | undefined,
   readyState: LiveRoomPlayerReadyState,
   errorMessage: string | undefined,
   connectedLabel: string,
   notConnectedLabel: string,
   readyLabel: string,
   notReadyLabel: string,
   afkLabel: string
) {
   if (!member?.connected) return notConnectedLabel;

   const currentPlayState = playState ?? member.playState;
   const readyStateLabel = formatReadyState(readyState, readyLabel, notReadyLabel, afkLabel);
   const currentDownloadState = downloadState ?? member.downloadState;
   const stateDetails = [getPlayStateDetail(currentPlayState), getDownloadStateDetail(currentDownloadState, errorMessage)].filter(
      (detail) => detail != null
   );
   const stateSuffix = stateDetails.length > 0 ? ` (${stateDetails.join(' / ')})` : '';

   if (isPlayingState(currentPlayState)) return `${connectedLabel}${stateSuffix}`;
   return `${connectedLabel} / ${readyStateLabel}${stateSuffix}`;
}

function isPlayingState(value: LiveRoomPlayerDisplayPlayState) {
   return value === 'PLAYING' || value === 'IN_GAME';
}

function getPlayStateDetail(value: LiveRoomPlayerDisplayPlayState) {
   switch (value) {
      case 'PLAYING':
      case 'IN_GAME':
         return 'Playing';
      case 'IDLE':
      case 'IN_MENU':
         return null;
      case 'PAUSED':
         return 'Paused';
      default:
         return formatEnumLabel(value);
   }
}

function getDownloadStateDetail(value: LiveRoomMember['downloadState'], errorMessage: string | undefined) {
   if (value === 'ERROR' && errorMessage) return `${formatEnumLabel(value)}: ${errorMessage}`;
   if (value === 'DOWNLOADING' || value === 'ERROR') return formatEnumLabel(value);
   return null;
}

function formatReadyState(value: LiveRoomPlayerReadyState, readyLabel: string, notReadyLabel: string, afkLabel: string) {
   switch (value) {
      case 'READY':
         return readyLabel;
      case 'AFK':
         return afkLabel;
      default:
         return notReadyLabel;
   }
}

function formatLastSeen(member: LiveRoomMember | null) {
   if (!member || (!member.connected && !wasSeenInRoom(member))) return '-';
   return <Time date={member.lastSeenAt} short />;
}

function wasSeenInRoom(member: LiveRoomMember) {
   return member.lastSeenAt > member.joinedAt;
}
