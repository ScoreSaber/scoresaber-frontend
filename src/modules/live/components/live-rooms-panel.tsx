'use client';

import { type FormEvent, type KeyboardEvent, useEffect, useMemo, useState } from 'react';

import { useRouter } from '@tanstack/react-router';
import { Activity, ArrowRight, Loader2, Plus, RadioTower, Trash2, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { followLiveRoom, upsertLiveRoom } from '@/modules/live/actions/admin';
import { LiveRoomCodePill } from '@/modules/live/components/live-room-code-pill';
import { LivePlayerCell } from '@/modules/live/components/live-room-player-list';
import { LiveTournamentPlayerSelectDialog } from '@/modules/live/components/live-tournament-player-select-dialog';
import { LiveTournamentTeamSelectDialog } from '@/modules/live/components/live-tournament-team-select-dialog';
import { FormField, LiveActionHeader, LiveRowActions, LiveSection, LiveTableShell } from '@/modules/live/components/live-ui';
import type { LudusRoomState } from '@/modules/live/ludus/packets/protobuf';
import { useLudus } from '@/modules/live/ludus/use-ludus';
import type {
   LiveTournamentRosterControllerListAuthorizedPlayersItem,
   LiveMatchRoomControllerListRoomsItem,
   LiveMatchRoomControllerGetRoomsViewResponse,
   LiveTournamentRosterControllerListTeamsItem,
   LiveMatchRoomControllerUpsertRoomResponse
} from '@/shared/api/generated/ApiParams';
import { formatNumber } from '@/shared/format/helpers';

type AuthorizedPlayerIdentity = NonNullable<LiveTournamentRosterControllerListAuthorizedPlayersItem['player']>;
type RoomRosterMode = LiveMatchRoomControllerListRoomsItem['rosterMode'];
type LiveWorkflowOptions = LiveMatchRoomControllerGetRoomsViewResponse['options'];
type LiveWorkflowAccess = LiveMatchRoomControllerGetRoomsViewResponse['access'];
type LiveRoomRow = LiveMatchRoomControllerListRoomsItem;

type RoomPlayerDraft = {
   playerId: string;
   player: AuthorizedPlayerIdentity | null;
   teamName: string | null;
};

export function LiveRoomsPanel({
   tournamentId,
   access,
   rooms,
   authorizedPlayers,
   teams,
   options,
   liveConnectionUrl
}: {
   tournamentId: string;
   access: LiveWorkflowAccess;
   rooms: LiveMatchRoomControllerListRoomsItem[];
   authorizedPlayers: LiveTournamentRosterControllerListAuthorizedPlayersItem[];
   teams: LiveTournamentRosterControllerListTeamsItem[];
   options: LiveWorkflowOptions;
   liveConnectionUrl: string | null;
}) {
   const t = useTranslations('live');
   const router = useRouter();
   const { user } = useAuth();
   const mutation = useActionMutation<LiveMatchRoomControllerUpsertRoomResponse>();
   const followMutation = useActionMutation();
   const [roomRows, setRoomRows] = useState<LiveRoomRow[]>(() => rooms);
   const [createOpen, setCreateOpen] = useState(false);
   const [pickerOpen, setPickerOpen] = useState(false);
   const [teamPickerOpen, setTeamPickerOpen] = useState(false);
   const [matchId, setMatchId] = useState('');
   const [rosterMode, setRosterMode] = useState<RoomRosterMode>('TEAM');
   const [players, setPlayers] = useState<RoomPlayerDraft[]>([]);
   const pending = mutation.isPending;
   const canFollowRooms = access.permissions.includes('CAST_MATCHES');
   const canUseOrganizerSocket = access.permissions.includes('CAST_MATCHES') || access.permissions.includes('COORDINATE_MATCHES');
   const playerIds = useMemo(() => new Set(players.map((player) => player.playerId)), [players]);
   const addedTeamIds = useMemo(() => getAddedTeamIds(teams, authorizedPlayers, playerIds), [authorizedPlayers, playerIds, teams]);
   const ludus = useLudus({
      enabled: Boolean(liveConnectionUrl && user),
      ludusBaseUrl: liveConnectionUrl,
      roomContext: 'TOURNAMENT',
      tournamentId,
      clientType: canUseOrganizerSocket ? 'ORGANIZER' : 'WEBSITE'
   });
   const roomStates = useMemo(() => new Map(ludus.rooms.map((room) => [room.matchId, room])), [ludus.rooms]);
   const sortedRoomRows = useMemo(
      () =>
         [...roomRows].sort(
            (a, b) =>
               getConnectedPlayerCount(b, roomStates, ludus.status === 'connected') -
                  getConnectedPlayerCount(a, roomStates, ludus.status === 'connected') || a.matchId.localeCompare(b.matchId)
         ),
      [ludus.status, roomRows, roomStates]
   );

   useEffect(() => {
      setRoomRows(rooms);
   }, [rooms]);

   function addPlayer(selection: LiveTournamentRosterControllerListAuthorizedPlayersItem) {
      const playerId = selection.playerId;
      if (players.some((player) => player.playerId === playerId)) {
         toast.error(t('playerAlreadyInRoom'));
         return;
      }

      setPlayers((current) => [
         ...current,
         {
            playerId,
            player: selection.player,
            teamName: selection.teamName
         }
      ]);
   }

   function addTeam(team: LiveTournamentRosterControllerListTeamsItem) {
      const teamPlayers = authorizedPlayers.filter((player) => player.teamId === team.id);
      if (teamPlayers.length === 0) {
         toast.error(t('noTeamPlayers'));
         return;
      }

      setPlayers((current) => {
         const byId = new Map(current.map((player) => [player.playerId, player]));
         for (const player of teamPlayers) {
            const playerId = player.playerId;
            byId.set(playerId, {
               playerId,
               player: player.player,
               teamName: player.teamName
            });
         }

         return [...byId.values()];
      });
   }

   function removePlayer(playerId: string) {
      setPlayers((current) => current.filter((player) => player.playerId !== playerId));
   }

   function resetCreateState() {
      setMatchId('');
      setRosterMode('TEAM');
      setPlayers([]);
      setPickerOpen(false);
      setTeamPickerOpen(false);
   }

   function setRosterModeValue(value: string) {
      if (options.roomRosterModes.includes(value as RoomRosterMode)) setRosterMode(value as RoomRosterMode);
   }

   function createRoom(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const roomName = matchId.trim();
      if (!roomName) {
         toast.error(t('invalidRoom'));
         return;
      }

      mutation.run(
         () =>
            upsertLiveRoom(tournamentId, {
               matchId: roomName,
               rosterMode,
               members: players.map((player) => ({
                  playerId: player.playerId,
                  role: 'PLAYER'
               }))
            }),
         t('roomSaved'),
         t('roomSaveFailed'),
         (room) => {
            setRoomRows((current) => upsertRoomRow(current, room));
            setCreateOpen(false);
            resetCreateState();
            void router.navigate({ to: '/live/$tournamentId/rooms/$matchId', params: { tournamentId, matchId: room.matchId } });
         }
      );
   }

   function openRoom(room: LiveRoomRow) {
      void router.navigate({ to: '/live/$tournamentId/rooms/$matchId', params: { tournamentId, matchId: room.matchId } });
   }

   function followRoom(matchId: string) {
      followMutation.runKeyed(matchId, () => followLiveRoom(tournamentId, matchId), t('followRoomSent'), t('followRoomFailed'));
   }

   function handleRoomKeyDown(event: KeyboardEvent<HTMLTableRowElement>, room: LiveRoomRow) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openRoom(room);
   }

   return (
      <>
         <LiveSection
            title={t('rooms')}
            icon={<Activity data-icon />}
            actions={
               <Button className="w-fit cursor-pointer" onClick={() => setCreateOpen(true)} disabled={pending}>
                  <Plus data-icon="inline-start" />
                  {t('createRoom')}
               </Button>
            }
         >
            <LiveTableShell className="max-h-[32rem]">
               <Table className="table-fixed">
                  <TableHeader>
                     <TableRow>
                        <TableHead className="w-[28%]">{t('room')}</TableHead>
                        <TableHead className="w-[15%] truncate">{t('players')}</TableHead>
                        <TableHead className="w-[18%] truncate">{t('connectedPlayers')}</TableHead>
                        <TableHead className="truncate">{t('selectedSong')}</TableHead>
                        <TableHead className="w-20 px-1 text-right">
                           <LiveActionHeader label={t('actions')} />
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {sortedRoomRows.length > 0 ? (
                        sortedRoomRows.map((room) => {
                           const roomState = roomStates.get(room.matchId);
                           const connectedPlayerCount = getConnectedPlayerCount(room, roomStates, ludus.status === 'connected');
                           const followPending = followMutation.isPendingKey(room.matchId);
                           let selectedSongName = room.selectedSong?.songName ?? '-';
                           if (roomState) {
                              selectedSongName = roomState.loadedSong ? room.selectedSong?.songName || roomState.loadedSongName || '-' : '-';
                           }

                           return (
                              <TableRow
                                 key={room.matchId}
                                 className="group/row cursor-pointer"
                                 role="link"
                                 tabIndex={0}
                                 onClick={() => openRoom(room)}
                                 onKeyDown={(event) => handleRoomKeyDown(event, room)}
                              >
                                 <TableCell>
                                    <div className="flex min-w-0 flex-col gap-1">
                                       <span className="truncate font-medium">{room.matchId}</span>
                                       <span className="flex min-w-0 items-center gap-1.5">
                                          <span className="sr-only">{t('roomCode')}</span>
                                          <LiveRoomCodePill roomCode={room.inviteCode} size="xs" />
                                       </span>
                                    </div>
                                 </TableCell>
                                 <TableCell>{t('playerCount', { count: getRoomPlayerCount(room) })}</TableCell>
                                 <TableCell>{formatNumber(connectedPlayerCount)}</TableCell>
                                 <TableCell className="overflow-hidden pr-3" title={selectedSongName === '-' ? undefined : selectedSongName}>
                                    <span className="block truncate">{selectedSongName}</span>
                                 </TableCell>
                                 <TableCell className="w-20 px-1 text-right">
                                    <LiveRowActions>
                                       {canFollowRooms ? (
                                          <Button
                                             type="button"
                                             variant="ghost-icon"
                                             size="icon-sm"
                                             className="cursor-pointer"
                                             onClick={(event) => {
                                                event.stopPropagation();
                                                followRoom(room.matchId);
                                             }}
                                             onKeyDown={(event) => event.stopPropagation()}
                                             disabled={!user || followMutation.isPending}
                                             title={t('followRoom')}
                                          >
                                             {followPending ? <Loader2 className="animate-spin" /> : <RadioTower data-icon />}
                                          </Button>
                                       ) : null}
                                       <Button
                                          type="button"
                                          variant="ghost-icon"
                                          size="icon-sm"
                                          className="cursor-pointer"
                                          onClick={(event) => {
                                             event.stopPropagation();
                                             openRoom(room);
                                          }}
                                          onKeyDown={(event) => event.stopPropagation()}
                                          title={t('manageRoom')}
                                       >
                                          <ArrowRight data-icon />
                                       </Button>
                                    </LiveRowActions>
                                 </TableCell>
                              </TableRow>
                           );
                        })
                     ) : (
                        <TableRow>
                           <TableCell colSpan={5} className="text-muted-foreground h-20 text-center">
                              {t('noRooms')}
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </LiveTableShell>
         </LiveSection>

         <Dialog
            open={createOpen}
            onOpenChange={(open) => {
               setCreateOpen(open);
               if (!open) resetCreateState();
            }}
         >
            <DialogContent className="h-dvh max-h-dvh max-w-none overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-xl sm:rounded-lg sm:border">
               <form className="flex h-full min-h-0 flex-col sm:max-h-[calc(100dvh-2rem)]" onSubmit={createRoom}>
                  <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
                     <DialogHeader>
                        <DialogTitle>{t('createRoom')}</DialogTitle>
                     </DialogHeader>
                     <FormField id="live-room-match-id" label={t('roomName')}>
                        <Input id="live-room-match-id" value={matchId} onChange={(event) => setMatchId(event.target.value)} disabled={pending} />
                     </FormField>
                     <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-semibold">{t('roomMode')}</h3>
                        <ToggleGroup type="single" value={rosterMode} onValueChange={setRosterModeValue} variant="outline" size="sm">
                           <ToggleGroupItem value="TEAM">{t('teamMode')}</ToggleGroupItem>
                           <ToggleGroupItem value="FLAT">{t('flatMode')}</ToggleGroupItem>
                        </ToggleGroup>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                           <h3 className="text-sm font-semibold">{t('players')}</h3>
                           <div className="flex flex-wrap justify-end gap-2">
                              <Button
                                 type="button"
                                 variant="outline"
                                 className="cursor-pointer"
                                 onClick={() => setPickerOpen(true)}
                                 disabled={pending}
                              >
                                 <UserPlus data-icon="inline-start" />
                                 {t('addPlayer')}
                              </Button>
                              <Button
                                 type="button"
                                 variant="outline"
                                 className="cursor-pointer"
                                 onClick={() => setTeamPickerOpen(true)}
                                 disabled={pending}
                              >
                                 <Users data-icon="inline-start" />
                                 {t('addTeam')}
                              </Button>
                           </div>
                        </div>
                        <LiveTableShell className="max-h-80">
                           <Table>
                              <TableHeader>
                                 <TableRow>
                                    <TableHead>{t('player')}</TableHead>
                                    <TableHead>{t('team')}</TableHead>
                                    <TableHead className="w-0 text-right">
                                       <LiveActionHeader label={t('actions')} />
                                    </TableHead>
                                 </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {players.length > 0 ? (
                                    players.map((player) => (
                                       <TableRow key={player.playerId} className="group/row">
                                          <TableCell className="min-w-56">
                                             <LivePlayerCell player={player.player} unknownLabel={t('unknownPlayer')} />
                                          </TableCell>
                                          <TableCell>{player.teamName ?? t('noTeam')}</TableCell>
                                          <TableCell className="text-right">
                                             <LiveRowActions>
                                                <Button
                                                   type="button"
                                                   variant="ghost"
                                                   size="icon-sm"
                                                   className="cursor-pointer"
                                                   onClick={() => removePlayer(player.playerId)}
                                                   disabled={pending}
                                                   title={t('removePlayer')}
                                                >
                                                   <Trash2 data-icon />
                                                </Button>
                                             </LiveRowActions>
                                          </TableCell>
                                       </TableRow>
                                    ))
                                 ) : (
                                    <TableRow>
                                       <TableCell colSpan={3} className="text-muted-foreground h-16 text-center">
                                          {t('noRoomPlayers')}
                                       </TableCell>
                                    </TableRow>
                                 )}
                              </TableBody>
                           </Table>
                        </LiveTableShell>
                     </div>
                  </div>
                  <DialogFooter className="bg-background border-t p-4 sm:p-6">
                     <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)} disabled={pending}>
                        {t('cancel')}
                     </Button>
                     <Button type="submit" className="cursor-pointer" disabled={pending || !matchId.trim()}>
                        {pending ? <Loader2 className="animate-spin" /> : <Plus data-icon="inline-start" />}
                        {t('createRoom')}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         <LiveTournamentPlayerSelectDialog
            open={pickerOpen}
            onOpenChangeAction={setPickerOpen}
            onSelectAction={addPlayer}
            players={authorizedPlayers}
            disabledPlayerIds={players.map((player) => player.playerId)}
            title={t('addRoomPlayer')}
         />
         <LiveTournamentTeamSelectDialog
            open={teamPickerOpen}
            onOpenChangeAction={setTeamPickerOpen}
            onSelectAction={addTeam}
            teams={teams}
            disabledTeamIds={addedTeamIds}
            title={t('addRoomTeam')}
         />
      </>
   );
}

function upsertRoomRow(rows: LiveRoomRow[], room: LiveMatchRoomControllerListRoomsItem): LiveRoomRow[] {
   const existing = rows.some((row) => row.matchId === room.matchId);
   return existing ? rows.map((row) => (row.matchId === room.matchId ? room : row)) : [...rows, room];
}

function getRoomPlayerCount(room: LiveRoomRow) {
   return room.members.filter((member) => member.role === 'PLAYER').length;
}

function getConnectedPlayerCount(room: LiveRoomRow, roomStates: Map<string, LudusRoomState>, ludusConnected: boolean) {
   const playerIds = new Set(room.members.filter((member) => member.role === 'PLAYER').map((member) => member.playerId));
   const roomState = roomStates.get(room.matchId);
   return roomState
      ? roomState.playerIds.filter((playerId) => playerIds.has(playerId)).length
      : ludusConnected
        ? 0
        : room.members.filter((member) => member.role === 'PLAYER' && member.connected).length;
}

function getAddedTeamIds(
   teams: LiveTournamentRosterControllerListTeamsItem[],
   authorizedPlayers: LiveTournamentRosterControllerListAuthorizedPlayersItem[],
   playerIds: Set<string>
) {
   return teams.flatMap((team) => {
      const teamPlayers = authorizedPlayers.filter((player) => player.teamId === team.id);
      if (teamPlayers.length === 0) return [];
      return teamPlayers.every((player) => playerIds.has(player.playerId)) ? [team.id] : [];
   });
}
