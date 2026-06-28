'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Link, useRouter } from '@tanstack/react-router';
import { Result } from 'better-result';
import {
   ArrowLeft,
   Bot,
   Loader2,
   MessageSquare,
   MoreHorizontal,
   Play,
   RotateCcw,
   Settings,
   Trash2,
   UserCheck,
   UserPlus,
   Users,
   UserX
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import {
   bottifyLivePlayer,
   bottifyLivePlayers,
   closeLiveRoom,
   deleteLiveRoom,
   promptLiveRoom,
   returnLiveRoomToMenu,
   setLiveRoomMembers,
   setLiveRoomSong,
   startLiveRoomMap,
   unbottifyLivePlayer,
   upsertLiveRoom
} from '@/modules/live/actions/admin';
import { LiveRoomChatSheet } from '@/modules/live/components/live-room-chat-panel';
import { LiveRoomCodePill } from '@/modules/live/components/live-room-code-pill';
import { LiveRoomControlsSheet } from '@/modules/live/components/live-room-controls-sheet';
import { LiveRoomFinalScoresTable } from '@/modules/live/components/live-room-final-scores-table';
import { LivePlayerCell, LiveRoomPlayerList, type LiveRoomPlayerListRow } from '@/modules/live/components/live-room-player-list';
import { LiveSongSelectDialog } from '@/modules/live/components/live-song-select-dialog';
import { LiveTournamentPlayerSelectDialog } from '@/modules/live/components/live-tournament-player-select-dialog';
import { LiveTournamentTeamSelectDialog } from '@/modules/live/components/live-tournament-team-select-dialog';
import { CheckboxRow, LiveTableShell } from '@/modules/live/components/live-ui';
import { getRoomPlayback, getRoomPlayerRows, type RoomMember, type RoomPlayerDraft } from '@/modules/live/lib/room-management';
import { useLudus } from '@/modules/live/ludus/use-ludus';
import type { LiveMatchRoomControllerSetRoomSongPayload } from '@/shared/api/generated/Api';
import type {
   LiveMatchRoomControllerGetRoomViewResponse,
   LiveMatchRoomControllerListRoomsItem,
   LiveMatchRoomControllerSetRoomMembersResponse,
   LiveMatchRoomControllerSetRoomSongResponse,
   LiveMatchRoomControllerUpsertRoomResponse,
   LiveTournamentRosterControllerListTeamsItem,
   LiveTournamentRosterControllerListAuthorizedPlayersItem
} from '@/shared/api/generated/ApiParams';
import { getArcviewerUrl } from '@/shared/arcviewer-url';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import { readStorageValue, writeStorageValue } from '@/shared/result/storage';

const liveRoomShowExtraInfoStorageKey = 'live-room:show-extra-info';
const liveRoomLiveRankSortStorageKey = 'live-room:live-rank-sort';

type RoomRosterMode = LiveMatchRoomControllerListRoomsItem['rosterMode'];
type RoomFinalScore = LiveMatchRoomControllerGetRoomViewResponse['finalScores'][number];
type LiveWorkflowOptions = LiveMatchRoomControllerGetRoomViewResponse['options'];
type LiveWorkflowAccess = LiveMatchRoomControllerGetRoomViewResponse['access'];
type LiveRoomUpsertPayload = Parameters<typeof upsertLiveRoom>[1] & { activePlayerIds?: string[] };
type LiveRoomMembersPayload = Parameters<typeof setLiveRoomMembers>[2] & { activePlayerIds?: string[] };
type LudusPromptResponses = ReturnType<typeof useLudus>['promptResponses'];
type LudusChatMessage = ReturnType<typeof useLudus>['chatMessages'][number];
type LudusRoom = ReturnType<typeof useLudus>['rooms'][number];

export function LiveRoomManagementPage({
   tournamentId,
   access,
   room: initialRoom,
   finalScores,
   authorizedPlayers,
   teams,
   options,
   liveConnectionUrl
}: {
   tournamentId: string;
   access: LiveWorkflowAccess;
   room: LiveMatchRoomControllerListRoomsItem;
   finalScores: RoomFinalScore[];
   authorizedPlayers: LiveTournamentRosterControllerListAuthorizedPlayersItem[];
   teams: LiveTournamentRosterControllerListTeamsItem[];
   options: LiveWorkflowOptions;
   liveConnectionUrl: string | null;
}) {
   const t = useTranslations('live');
   const tc = useTranslations('common');
   const router = useRouter();
   const { user } = useAuth();
   const membersMutation = useActionMutation<LiveMatchRoomControllerSetRoomMembersResponse>();
   const songMutation = useActionMutation<LiveMatchRoomControllerSetRoomSongResponse>();
   const closeMutation = useActionMutation();
   const reopenMutation = useActionMutation<LiveMatchRoomControllerUpsertRoomResponse>();
   const deleteMutation = useActionMutation();
   const startMutation = useActionMutation();
   const stopMutation = useActionMutation();
   const promptMutation = useActionMutation();
   const bottifyMutation = useActionMutation();
   const bottifyAllMutation = useActionMutation<{ count: number }>();
   const unbottifyMutation = useActionMutation();
   const [room, setRoom] = useState(initialRoom);
   const [roomPlayers, setRoomPlayers] = useState(() => getRoomPlayerDrafts(initialRoom.members, authorizedPlayers));
   const [rosterMode, setRosterMode] = useState<RoomRosterMode>(initialRoom.rosterMode);
   const [countdownSeconds, setCountdownSeconds] = useState('10');
   const [forceStart, setForceStart] = useState(false);
   const [promptMessage, setPromptMessage] = useState('');
   const [promptTarget, setPromptTarget] = useState('all');
   const [playerPickerOpen, setPlayerPickerOpen] = useState(false);
   const [teamPickerOpen, setTeamPickerOpen] = useState(false);
   const [songDialogOpen, setSongDialogOpen] = useState(false);
   const [controlsOpen, setControlsOpen] = useState(false);
   const [chatOpen, setChatOpen] = useState(false);
   const [showExtraInfo, setShowExtraInfo] = useState(() => Result.unwrapOr(readStorageValue(liveRoomShowExtraInfoStorageKey), 'false') === 'true');
   const [liveSortByRank, setLiveSortByRank] = useState(() => Result.unwrapOr(readStorageValue(liveRoomLiveRankSortStorageKey), 'false') === 'true');
   const [promptHistoryPlayerId, setPromptHistoryPlayerId] = useState<string | null>(null);
   const [singlePromptPlayerId, setSinglePromptPlayerId] = useState<string | null>(null);
   const [singlePromptMessage, setSinglePromptMessage] = useState('');
   const [bottifyPlayerId, setBottifyPlayerId] = useState<string | null>(null);
   const [bottifyAutoReady, setBottifyAutoReady] = useState(true);
   const [bottifyErratic, setBottifyErratic] = useState(false);
   const [bottifyAllOpen, setBottifyAllOpen] = useState(false);
   const [bottifyAllAutoReady, setBottifyAllAutoReady] = useState(true);
   const [bottifyAllErratic, setBottifyAllErratic] = useState(false);
   const [removePlayerId, setRemovePlayerId] = useState<string | null>(null);
   const [startConfirmOpen, setStartConfirmOpen] = useState(false);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [nowMs, setNowMs] = useState(() => Date.now());
   const [resultsRefreshing, setResultsRefreshing] = useState(false);
   const pendingResultRefreshKey = useRef<string | null>(null);
   const refreshedResultKey = useRef<string | null>(null);
   const canManageRoomPlayers = access.permissions.includes('MANAGE_MATCH_ROOMS');
   const canPromptPlayers = access.permissions.includes('COORDINATE_MATCHES');
   const canCastMatches = access.permissions.includes('CAST_MATCHES');
   const canUsePlayerActions = canManageRoomPlayers || canPromptPlayers || canCastMatches;
   const canUseOrganizerSocket = canPromptPlayers || canCastMatches;
   const roomPlayerIds = useMemo(() => new Set(roomPlayers.map((player) => player.playerId)), [roomPlayers]);
   const addedTeamIds = useMemo(() => getAddedTeamIds(teams, authorizedPlayers, roomPlayerIds), [authorizedPlayers, roomPlayerIds, teams]);
   const ludus = useLudus({
      enabled: Boolean(liveConnectionUrl && user),
      ludusBaseUrl: liveConnectionUrl,
      roomContext: 'TOURNAMENT',
      tournamentId,
      clientType: canUseOrganizerSocket ? 'ORGANIZER' : 'WEBSITE',
      targetMatchId: canUseOrganizerSocket ? room.matchId : undefined
   });
   const ludusRoom = useMemo(() => ludus.rooms.find((ludusRoom) => ludusRoom.matchId === room.matchId) ?? null, [ludus.rooms, room.matchId]);
   const roomScores = useMemo(() => ludus.scores.filter((score) => score.matchId === room.matchId), [ludus.scores, room.matchId]);
   const roomChatMessages = useMemo(
      () => ludus.chatMessages.filter((message) => message.matchId === room.matchId).sort(compareLudusChatMessages),
      [ludus.chatMessages, room.matchId]
   );
   const activeRoomCountdown = useMemo(
      () => ludus.roomCountdowns.find((countdown) => countdown.matchId === room.matchId && countdown.startTimeUnixMs > nowMs) ?? null,
      [ludus.roomCountdowns, nowMs, room.matchId]
   );
   const roomCountdownLabel = activeRoomCountdown
      ? t('countdownStatus', { count: Math.max(1, Math.ceil((activeRoomCountdown.startTimeUnixMs - nowMs) / 1000)) })
      : null;
   const managedPlayerRows = useMemo(
      () => getRoomPlayerRows(roomPlayers, room.members, ludusRoom, roomScores, t('connected'), roomCountdownLabel),
      [ludusRoom, room.members, roomCountdownLabel, roomPlayers, roomScores, t]
   );
   const activePlayerRows = useMemo(() => managedPlayerRows.filter((player) => player.active ?? true), [managedPlayerRows]);
   const inactivePlayerRows = useMemo(() => managedPlayerRows.filter((player) => !(player.active ?? true)), [managedPlayerRows]);
   const bottifiablePlayerRows = useMemo(() => activePlayerRows.filter((player) => !player.isBot), [activePlayerRows]);
   const unreadyPlayerRows = useMemo(() => activePlayerRows.filter((player) => player.readyState !== 'READY'), [activePlayerRows]);
   const roomPlayback = useMemo(() => getRoomPlayback(ludusRoom, roomScores, nowMs), [ludusRoom, nowMs, roomScores]);
   const roomStatusLabel =
      ludus.error != null
         ? getLudusErrorDescription(ludus.error)
         : roomCountdownLabel != null
           ? roomCountdownLabel
           : roomPlayback.playing
             ? `${t('roomStatusPlaying')}${roomPlayback.songPositionMs == null ? '' : ` (${formatSongPosition(roomPlayback.songPositionMs)})`}`
             : t('roomStatusIdle');
   const promptResponsesByPlayer = useMemo(
      () => getPromptResponsesByPlayer(room.matchId, ludus.promptResponses),
      [ludus.promptResponses, room.matchId]
   );
   const promptHistoryRow = promptHistoryPlayerId ? (managedPlayerRows.find((row) => row.playerId === promptHistoryPlayerId) ?? null) : null;
   const promptHistoryResponses = promptHistoryPlayerId ? (promptResponsesByPlayer.get(promptHistoryPlayerId) ?? []) : [];
   const singlePromptPlayer = singlePromptPlayerId ? (managedPlayerRows.find((row) => row.playerId === singlePromptPlayerId) ?? null) : null;
   const bottifyPlayer = bottifyPlayerId ? (managedPlayerRows.find((row) => row.playerId === bottifyPlayerId) ?? null) : null;
   const removePlayer = removePlayerId ? (managedPlayerRows.find((row) => row.playerId === removePlayerId) ?? null) : null;
   const liveScoreKey = useMemo(
      () =>
         roomScores
            .map((score) => `${score.playerId}:${score.sourceStreamId}:${score.sourceSequence}`)
            .sort()
            .join('|'),
      [roomScores]
   );
   const playerListLabels = {
      player: t('player'),
      state: t('state'),
      lastSeen: t('lastSeen'),
      role: t('role'),
      participation: t('participation'),
      rank: t('rank'),
      score: t('score'),
      accuracy: tc('accuracy'),
      combo: t('combo'),
      misses: tc('misses'),
      lastPromptResponse: t('lastPromptResponse'),
      actions: tc('actions'),
      noTeam: t('noTeam'),
      unknownPlayer: t('unknownPlayer'),
      connected: t('connected'),
      notConnected: t('notConnected'),
      active: t('active'),
      inactive: t('inactive'),
      ready: t('ready'),
      notReady: t('notReady'),
      afk: t('afk')
   };
   const pending =
      membersMutation.isPending ||
      songMutation.isPending ||
      closeMutation.isPending ||
      reopenMutation.isPending ||
      deleteMutation.isPending ||
      startMutation.isPending ||
      stopMutation.isPending ||
      promptMutation.isPending ||
      bottifyMutation.isPending ||
      bottifyAllMutation.isPending ||
      unbottifyMutation.isPending;

   useEffect(() => {
      setRoom(initialRoom);
      setRoomPlayers(getRoomPlayerDrafts(initialRoom.members, authorizedPlayers));
      setRosterMode(initialRoom.rosterMode);
   }, [initialRoom, authorizedPlayers]);

   useEffect(() => {
      if (promptTarget !== 'all' && !roomPlayers.some((player) => player.playerId === promptTarget)) {
         setPromptTarget('all');
      }
   }, [promptTarget, roomPlayers]);

   useEffect(() => {
      writeStorageValue(liveRoomShowExtraInfoStorageKey, String(showExtraInfo));
   }, [showExtraInfo]);

   useEffect(() => {
      writeStorageValue(liveRoomLiveRankSortStorageKey, String(liveSortByRank));
   }, [liveSortByRank]);

   useEffect(() => {
      if (ludus.roomCountdowns.some((countdown) => countdown.matchId === room.matchId)) {
         setNowMs(Date.now());
      }
   }, [ludus.roomCountdowns, room.matchId]);

   useEffect(() => {
      const intervalMs = activeRoomCountdown ? 250 : roomPlayback.playing ? 1000 : 30_000;
      const intervalId = window.setInterval(() => setNowMs(Date.now()), intervalMs);
      return () => window.clearInterval(intervalId);
   }, [activeRoomCountdown, roomPlayback.playing]);

   useEffect(() => {
      if (liveScoreKey) {
         pendingResultRefreshKey.current = liveScoreKey;
         setResultsRefreshing(false);
         return;
      }

      const refreshKey = pendingResultRefreshKey.current;
      if (!refreshKey || refreshedResultKey.current === refreshKey || roomPlayback.playing) return;

      const timeoutId = window.setTimeout(() => {
         refreshedResultKey.current = refreshKey;
         setResultsRefreshing(true);
         void router.invalidate().finally(() => setResultsRefreshing(false));
      }, 1500);

      return () => window.clearTimeout(timeoutId);
   }, [liveScoreKey, roomPlayback.playing, router]);

   useEffect(() => {
      function handleRoomMenuShortcut(event: KeyboardEvent) {
         if (!(event.metaKey || event.ctrlKey)) return;

         if (event.key === 'Backspace') {
            event.preventDefault();
            void router.navigate({ to: '/live/$tournamentId/rooms', params: { tournamentId } });
            return;
         }

         if (event.key.toLowerCase() !== 'b' && event.key.toLowerCase() !== 'm') return;

         event.preventDefault();
         setControlsOpen((open) => !open);
      }

      document.addEventListener('keydown', handleRoomMenuShortcut);
      return () => document.removeEventListener('keydown', handleRoomMenuShortcut);
   }, [router, tournamentId]);

   function addPlayer(selection: LiveTournamentRosterControllerListAuthorizedPlayersItem) {
      const playerId = selection.playerId;
      if (roomPlayerIds.has(playerId)) {
         toast.error(t('playerAlreadyInRoom'));
         return;
      }

      persistRoomPlayers([...roomPlayers, toRoomPlayerDraft(selection)], rosterMode, t('roomPlayersSaved'));
   }

   function addTeam(team: LiveTournamentRosterControllerListTeamsItem) {
      const teamPlayers = authorizedPlayers.filter((player) => player.teamId === team.id);
      if (teamPlayers.length === 0) {
         toast.error(t('noTeamPlayers'));
         return;
      }

      const byId = new Map(roomPlayers.map((player) => [player.playerId, player]));
      for (const player of teamPlayers) {
         if (!byId.has(player.playerId)) byId.set(player.playerId, toRoomPlayerDraft(player));
      }

      persistRoomPlayers([...byId.values()], rosterMode, t('roomPlayersSaved'), () => setTeamPickerOpen(false));
   }

   function removePlayerFromRoom(playerId: string) {
      persistRoomPlayers(
         roomPlayers.filter((player) => player.playerId !== playerId),
         rosterMode,
         t('playerRemovedFromRoom'),
         () => setRemovePlayerId(null)
      );
   }

   function persistRoomPlayers(nextRoomPlayers: RoomPlayerDraft[], nextRosterMode: RoomRosterMode, successLabel: string, onSuccess?: () => void) {
      membersMutation.run(
         () =>
            setLiveRoomMembers(tournamentId, room.matchId, {
               members: toRoomMemberPayload(nextRoomPlayers, room.members),
               activePlayerIds: getActivePlayerIds(nextRoomPlayers),
               rosterMode: nextRosterMode
            } satisfies LiveRoomMembersPayload),
         successLabel,
         t('membersSaveFailed'),
         (nextRoom) => {
            setRoom(nextRoom);
            setRoomPlayers(getRoomPlayerDrafts(nextRoom.members, authorizedPlayers));
            setRosterMode(nextRoom.rosterMode);
            onSuccess?.();
         }
      );
   }

   function openPromptForPlayer(playerId: string) {
      setSinglePromptPlayerId(playerId);
      setSinglePromptMessage('');
   }

   function openBottifyForPlayer(playerId: string) {
      setBottifyPlayerId(playerId);
      setBottifyAutoReady(true);
   }

   function openBottifyAll() {
      if (bottifiablePlayerRows.length === 0) {
         toast.error(t('noPlayersToBottify'));
         return;
      }

      setBottifyAllAutoReady(true);
      setBottifyAllOpen(true);
   }

   function changeSong(song: LiveMatchRoomControllerSetRoomSongPayload) {
      songMutation.run(
         () => setLiveRoomSong(tournamentId, room.matchId, song),
         t('songLoadQueued'),
         t('songLoadFailed'),
         (result) => setRoom(result.room)
      );
   }

   function closeRoom() {
      closeMutation.run(
         () => closeLiveRoom(tournamentId, room.matchId),
         t('roomClosed'),
         t('roomCloseFailed'),
         () => {
            const closedAt = new Date().toISOString();
            setRoom((current) => ({ ...current, state: 'CLOSED', closedAt, updatedAt: closedAt }));
         }
      );
   }

   function reopenRoom() {
      reopenMutation.run(
         () =>
            upsertLiveRoom(tournamentId, {
               matchId: room.matchId,
               rosterMode,
               members: toRoomMemberPayload(roomPlayers, room.members),
               activePlayerIds: getActivePlayerIds(roomPlayers)
            } satisfies LiveRoomUpsertPayload),
         t('roomReopened'),
         t('roomReopenFailed'),
         (nextRoom) => {
            setRoom(nextRoom);
            setRosterMode(nextRoom.rosterMode);
         }
      );
   }

   function setRosterModeValue(value: string) {
      if (options.roomRosterModes.includes(value as RoomRosterMode) && value !== rosterMode) {
         persistRoomPlayers(roomPlayers, value as RoomRosterMode, t('roomPlayersSaved'));
      }
   }

   function setPlayerActive(playerId: string, active: boolean) {
      persistRoomPlayers(
         roomPlayers.map((player) => (player.playerId === playerId ? { ...player, active } : player)),
         rosterMode,
         active ? t('playerMarkedActive') : t('playerMarkedInactive')
      );
   }

   function removeRoom() {
      deleteMutation.run(
         () => deleteLiveRoom(tournamentId, room.matchId),
         t('roomDeleted'),
         t('roomDeleteFailed'),
         () => {
            setRoomPlayers(getRoomPlayerDrafts(room.members, authorizedPlayers));
            setRosterMode(room.rosterMode);
            void router.invalidate().then(() => router.navigate({ to: '/live/$tournamentId/rooms', params: { tournamentId } }));
         }
      );
   }

   function requestStartMap() {
      if (unreadyPlayerRows.length > 0) {
         setStartConfirmOpen(true);
         return;
      }

      startMap();
   }

   function startMap() {
      const seconds = Number(countdownSeconds);
      const countdownMs = forceStart ? 0 : Math.max(0, Math.min(120, Number.isFinite(seconds) ? seconds : 0)) * 1000;

      startMutation.run(
         () =>
            startLiveRoomMap(tournamentId, room.matchId, {
               withSync: true,
               countdownMs,
               forceStart
            }),
         t('startCommandSent'),
         t('commandFailed'),
         () => setStartConfirmOpen(false)
      );
   }

   function stopMap() {
      stopMutation.run(() => returnLiveRoomToMenu(tournamentId, room.matchId), t('returnCommandSent'), t('commandFailed'));
   }

   function sendPrompt(target = promptTarget, rawMessage = promptMessage, onSuccess?: () => void) {
      const message = rawMessage.trim();
      if (!message) {
         toast.error(t('promptRequired'));
         return;
      }

      const playerIds = target === 'all' ? roomPlayers.map((player) => player.playerId) : [target];
      if (playerIds.length === 0) {
         toast.error(t('noRoomPlayers'));
         return;
      }

      promptMutation.run(
         () =>
            promptLiveRoom(tournamentId, room.matchId, {
               playerIds,
               title: t('readyCheck'),
               message,
               primaryText: t('yes'),
               secondaryText: t('no')
            }),
         t('promptSent'),
         t('promptFailed'),
         () => {
            setPromptMessage('');
            onSuccess?.();
         }
      );
   }

   function sendRoomChatMessage(message: string) {
      const text = message.trim();
      if (!text) {
         toast.error(t('roomChatMessageRequired'));
         return false;
      }

      if (!ludus.sendChatMessage(room.matchId, text, user?.name)) {
         toast.error(t('roomChatUnavailable'));
         return false;
      }
      return true;
   }

   function sendSinglePrompt() {
      if (!singlePromptPlayerId) return;
      sendPrompt(singlePromptPlayerId, singlePromptMessage, () => {
         setSinglePromptMessage('');
         setSinglePromptPlayerId(null);
      });
   }

   function submitBottify() {
      if (!bottifyPlayerId) return;

      bottifyMutation.run(
         () => bottifyLivePlayer(tournamentId, room.matchId, bottifyPlayerId, { autoReady: bottifyAutoReady, erratic: bottifyErratic }),
         t('bottifyQueued'),
         t('bottifyFailed'),
         () => setBottifyPlayerId(null)
      );
   }

   function submitBottifyAll() {
      const playerIds = bottifiablePlayerRows.map((player) => player.playerId);
      if (playerIds.length === 0) {
         toast.error(t('noPlayersToBottify'));
         return;
      }

      bottifyAllMutation.run(
         () => bottifyLivePlayers(tournamentId, room.matchId, playerIds, { autoReady: bottifyAllAutoReady, erratic: bottifyAllErratic }),
         t('bottifyAllQueued'),
         t('bottifyAllFailed'),
         () => setBottifyAllOpen(false)
      );
   }

   function unbottifyPlayer(playerId: string) {
      unbottifyMutation.run(() => unbottifyLivePlayer(tournamentId, room.matchId, playerId), t('unbottifyQueued'), t('unbottifyFailed'));
   }

   function getLudusErrorDescription(error: string) {
      if (error === 'not-configured') return t('liveServiceUnavailableDescription');
      if (error === 'socket-error') return t('liveSocketErrorDescription');
      return error;
   }

   function formatPromptAge(respondedAtUnixMs: number) {
      const elapsedSeconds = Math.max(0, Math.floor((nowMs - respondedAtUnixMs) / 1000));
      if (elapsedSeconds < 10) return t('justNow');
      if (elapsedSeconds < 60) return t('secondsAgo', { count: elapsedSeconds });

      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      if (elapsedMinutes < 60) return t('minutesAgo', { count: elapsedMinutes });

      const elapsedHours = Math.floor(elapsedMinutes / 60);
      if (elapsedHours < 24) return t('hoursAgo', { count: elapsedHours });

      return t('daysAgo', { count: Math.floor(elapsedHours / 24) });
   }

   function renderLastPromptResponse(player: LiveRoomPlayerListRow) {
      const responses = promptResponsesByPlayer.get(player.playerId) ?? [];
      const latestResponse = responses[0];
      if (!latestResponse) return '-';

      return (
         <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs font-medium"
            onClick={() => setPromptHistoryPlayerId(player.playerId)}
         >
            {latestResponse.accepted ? t('promptResponseYes') : t('promptResponseNo')} ({formatPromptAge(latestResponse.respondedAtUnixMs)})
         </Button>
      );
   }

   const controls = (
      <LiveRoomControlsSheet
         open={controlsOpen}
         room={room}
         roomPlayers={roomPlayers}
         pending={pending}
         canPromptPlayers={canPromptPlayers}
         bottifiablePlayerCount={bottifiablePlayerRows.length}
         countdownSeconds={countdownSeconds}
         forceStart={forceStart}
         promptTarget={promptTarget}
         promptMessage={promptMessage}
         songPending={songMutation.isPending}
         startPending={startMutation.isPending}
         stopPending={stopMutation.isPending}
         promptPending={promptMutation.isPending}
         bottifyAllPending={bottifyAllMutation.isPending}
         onOpenChangeAction={setControlsOpen}
         onCountdownSecondsChangeAction={setCountdownSeconds}
         onForceStartChangeAction={setForceStart}
         onPromptTargetChangeAction={setPromptTarget}
         onPromptMessageChangeAction={setPromptMessage}
         onOpenSongDialogAction={() => setSongDialogOpen(true)}
         onRequestStartMapAction={requestStartMap}
         onStopMapAction={stopMap}
         onSendPromptAction={() => sendPrompt()}
         onOpenBottifyAllAction={openBottifyAll}
         onCloseRoomAction={closeRoom}
         onReopenRoomAction={reopenRoom}
         onOpenDeleteDialogAction={() => setDeleteDialogOpen(true)}
      />
   );
   const chat = (
      <LiveRoomChatSheet
         open={chatOpen}
         onOpenChangeAction={setChatOpen}
         messages={roomChatMessages}
         disabled={!ludus.canSendChat}
         onSendAction={sendRoomChatMessage}
      />
   );

   return (
      <div className="relative z-10 flex h-[calc(100dvh-var(--content-offset-top)-var(--content-offset-bottom))] w-full flex-col gap-3 overflow-x-hidden overflow-y-auto px-3 py-3 md:px-4 lg:h-dvh">
         <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="-ml-2 flex max-w-full flex-wrap items-start gap-x-2 gap-y-1 text-left">
               <Link
                  to="/live/$tournamentId/rooms"
                  params={{ tournamentId }}
                  className="focus-visible:border-ring focus-visible:ring-ring/50 group grid max-w-full min-w-0 cursor-pointer grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 rounded-md px-2 py-1 transition-colors focus-visible:ring-[3px] focus-visible:outline-hidden"
               >
                  <ArrowLeft
                     data-icon
                     className="text-muted-foreground group-hover:text-primary group-focus-visible:text-primary transition-colors"
                  />
                  <span className="flex min-w-0 flex-col">
                     <span className="group-hover:text-primary group-focus-visible:text-primary truncate text-xl font-semibold tracking-tight transition-colors sm:text-2xl">
                        {room.matchId}
                     </span>
                     <span className="text-muted-foreground group-hover:text-primary group-focus-visible:text-primary font-medium transition-colors">
                        {t('backToRooms')}
                     </span>
                  </span>
               </Link>
               <span className="mt-1.5 flex min-w-0 items-center gap-1.5">
                  <span className="sr-only">{t('roomCode')}</span>
                  <LiveRoomCodePill roomCode={room.inviteCode} />
               </span>
            </div>

            <div className="flex w-full flex-wrap items-end justify-end gap-2 xl:w-auto">
               <Button type="button" variant="outline" onClick={() => setPlayerPickerOpen(true)} disabled={pending}>
                  <UserPlus data-icon="inline-start" />
                  {t('addPlayer')}
               </Button>
               <Button type="button" variant="outline" onClick={() => setTeamPickerOpen(true)} disabled={pending}>
                  <Users data-icon="inline-start" />
                  {t('addTeam')}
               </Button>
               {chat}
               {controls}
            </div>
         </div>
         <Separator variant="fade" />

         {!user ? (
            <Alert>
               <AlertTitle>{t('signInRequired')}</AlertTitle>
               <AlertDescription>{t('signInRequiredDescription')}</AlertDescription>
            </Alert>
         ) : null}

         <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
               <span>
                  <span className="text-foreground font-medium">{t('status')}:</span>{' '}
                  <span className={cn(ludus.error != null && 'text-destructive')}>{roomStatusLabel}</span>
               </span>
               <span>
                  <span className="text-foreground font-medium">{t('participation')}:</span>{' '}
                  {t('activeInactiveSummary', { active: activePlayerRows.length, inactive: inactivePlayerRows.length })}
               </span>
            </p>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button type="button" variant="secondary" size="icon-sm" title={t('roomTableSettings')}>
                     <Settings data-icon />
                     <span className="sr-only">{t('roomTableSettings')}</span>
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                     <DropdownMenuLabel>{t('roomMode')}</DropdownMenuLabel>
                     <DropdownMenuRadioGroup value={rosterMode} onValueChange={setRosterModeValue}>
                        <DropdownMenuRadioItem value="TEAM" disabled={membersMutation.isPending}>
                           {t('teamMode')}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="FLAT" disabled={membersMutation.isPending}>
                           {t('flatMode')}
                        </DropdownMenuRadioItem>
                     </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuLabel>{t('displayOptions')}</DropdownMenuLabel>
                     <DropdownMenuCheckboxItem checked={showExtraInfo} onCheckedChange={(checked) => setShowExtraInfo(checked === true)}>
                        {t('extraInfo')}
                     </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem checked={liveSortByRank} onCheckedChange={(checked) => setLiveSortByRank(checked === true)}>
                        {t('liveRankSort')}
                     </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>

         <div className="flex min-h-0 flex-col gap-3">
            <LiveRoomPlayerList
               rows={managedPlayerRows}
               mode={rosterMode}
               labels={playerListLabels}
               emptyLabel={t('noRoomPlayers')}
               maxHeightClassName="shrink-0 min-h-[34rem] max-h-[72dvh]"
               showState
               showParticipation
               showLastSeen
               showAccuracy
               showLastPromptResponse
               showExtraInfo={showExtraInfo}
               sortMode={liveSortByRank ? 'song-rank' : 'name'}
               renderLastPromptResponse={renderLastPromptResponse}
               rowAction={
                  canUsePlayerActions
                     ? (player) => {
                          const arcviewerUrl = canCastMatches ? getLivePlayerArcviewerUrl(player, tournamentId, ludusRoom) : null;
                          if (!arcviewerUrl && !canPromptPlayers && !canManageRoomPlayers) return null;

                          return (
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button type="button" variant="ghost-icon" size="icon-sm" disabled={pending} title={t('playerActions')}>
                                      <MoreHorizontal data-icon />
                                   </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                   <DropdownMenuGroup>
                                      {arcviewerUrl ? (
                                         <DropdownMenuItem asChild>
                                            <a href={arcviewerUrl} target="_blank" rel="noopener noreferrer">
                                               <Play />
                                               {t('watchLivePlayer')}
                                            </a>
                                         </DropdownMenuItem>
                                      ) : null}
                                      {canPromptPlayers ? (
                                         <DropdownMenuItem onClick={() => openPromptForPlayer(player.playerId)} disabled={pending}>
                                            <MessageSquare />
                                            {t('promptPlayer')}
                                         </DropdownMenuItem>
                                      ) : null}
                                      {canPromptPlayers && player.isBot ? (
                                         <DropdownMenuItem onClick={() => unbottifyPlayer(player.playerId)} disabled={pending}>
                                            <RotateCcw />
                                            {t('unbottifyPlayer')}
                                         </DropdownMenuItem>
                                      ) : null}
                                      {canPromptPlayers && !player.isBot ? (
                                         <DropdownMenuItem onClick={() => openBottifyForPlayer(player.playerId)} disabled={pending}>
                                            <Bot />
                                            {t('bottifyPlayer')}
                                         </DropdownMenuItem>
                                      ) : null}
                                      {canManageRoomPlayers ? (
                                         <DropdownMenuItem
                                            onClick={() => setPlayerActive(player.playerId, !(player.active ?? true))}
                                            disabled={pending}
                                         >
                                            {(player.active ?? true) ? <UserX /> : <UserCheck />}
                                            {(player.active ?? true) ? t('markPlayerInactive') : t('markPlayerActive')}
                                         </DropdownMenuItem>
                                      ) : null}
                                      {canManageRoomPlayers ? (
                                         <DropdownMenuItem
                                            variant="destructive"
                                            onClick={() => setRemovePlayerId(player.playerId)}
                                            disabled={pending}
                                         >
                                            <Trash2 />
                                            {t('removePlayerFromRoom')}
                                         </DropdownMenuItem>
                                      ) : null}
                                   </DropdownMenuGroup>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          );
                       }
                     : undefined
               }
            />

            <section className="flex min-h-0 flex-col gap-2">
               <div className="flex items-center justify-between gap-3">
                  <h2 className="text-muted-foreground text-sm font-semibold">{t('recentResults')}</h2>
                  {resultsRefreshing ? (
                     <span className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Loader2 className="size-3 animate-spin" />
                        {t('syncingResults')}
                     </span>
                  ) : null}
               </div>
               <LiveRoomFinalScoresTable
                  scores={finalScores}
                  emptyLabel={t('noRecentResults')}
                  labels={{
                     player: t('player'),
                     rank: t('rank'),
                     score: t('score'),
                     accuracy: tc('accuracy'),
                     misses: tc('misses'),
                     completion: t('completion'),
                     reportedAt: t('reportedAt'),
                     unknownMap: t('unknownMap'),
                     unknownPlayer: t('unknownPlayer')
                  }}
               />
            </section>
         </div>

         <Dialog open={promptHistoryRow != null} onOpenChange={(open) => !open && setPromptHistoryPlayerId(null)}>
            <DialogContent className="max-w-xl">
               <DialogHeader>
                  <DialogTitle>
                     {t('promptResponseHistoryForPlayer', { player: promptHistoryRow ? getRoomPlayerName(promptHistoryRow) : '-' })}
                  </DialogTitle>
               </DialogHeader>
               <LiveTableShell className="max-h-96">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>{t('readyCheck')}</TableHead>
                           <TableHead>{t('response')}</TableHead>
                           <TableHead>{t('respondedAt')}</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {promptHistoryResponses.map((response) => (
                           <TableRow key={`${response.commandId}-${response.respondedAtUnixMs}`}>
                              <TableCell className="max-w-80 break-words whitespace-normal">{response.promptMessage}</TableCell>
                              <TableCell>{response.accepted ? t('promptResponseYes') : t('promptResponseNo')}</TableCell>
                              <TableCell>
                                 <Time date={response.respondedAtUnixMs} short />
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </LiveTableShell>
            </DialogContent>
         </Dialog>

         <ConfirmDialog
            open={singlePromptPlayer != null}
            onOpenChangeAction={(open) => {
               if (!open) {
                  setSinglePromptPlayerId(null);
                  setSinglePromptMessage('');
               }
            }}
            title={t('promptPlayer')}
            description={t('promptPlayerDescription', { player: singlePromptPlayer ? getRoomPlayerName(singlePromptPlayer) : '-' })}
            confirmLabel={t('sendPrompt')}
            pending={promptMutation.isPending}
            textInput={{
               label: t('promptPlayerMessage'),
               value: singlePromptMessage,
               onValueChangeAction: setSinglePromptMessage,
               placeholder: t('promptPlaceholder'),
               required: true,
               disabled: promptMutation.isPending
            }}
            onConfirmAction={sendSinglePrompt}
         />

         <ConfirmDialog
            open={removePlayer != null}
            onOpenChangeAction={(open) => !open && setRemovePlayerId(null)}
            title={t('removePlayerFromRoom')}
            description={t('removePlayerFromRoomDescription', { player: removePlayer ? getRoomPlayerName(removePlayer) : '-' })}
            confirmLabel={t('removePlayerFromRoom')}
            variant="destructive"
            pending={membersMutation.isPending}
            onConfirmAction={() => {
               if (removePlayerId) removePlayerFromRoom(removePlayerId);
            }}
         />

         <Dialog
            open={bottifyPlayer != null}
            onOpenChange={(open) => {
               if (!open) {
                  setBottifyPlayerId(null);
                  setBottifyAutoReady(true);
                  setBottifyErratic(false);
               }
            }}
         >
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>{t('bottifyPlayer')}</DialogTitle>
                  <DialogDescription>
                     {t('bottifyPlayerDescription', { player: bottifyPlayer ? getRoomPlayerName(bottifyPlayer) : '-' })}
                  </DialogDescription>
               </DialogHeader>
               <CheckboxRow
                  label={t('bottifyAutoReady')}
                  checked={bottifyAutoReady}
                  onCheckedChangeAction={setBottifyAutoReady}
                  disabled={bottifyMutation.isPending}
               />
               <CheckboxRow
                  label={t('bottifyErratic')}
                  checked={bottifyErratic}
                  onCheckedChangeAction={setBottifyErratic}
                  disabled={bottifyMutation.isPending}
               />
               <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setBottifyPlayerId(null)} disabled={bottifyMutation.isPending}>
                     {tc('cancel')}
                  </Button>
                  <Button type="button" onClick={submitBottify} disabled={bottifyMutation.isPending}>
                     {bottifyMutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                     {t('bottifyPlayer')}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <Dialog
            open={bottifyAllOpen}
            onOpenChange={(open) => {
               setBottifyAllOpen(open);
               if (!open) {
                  setBottifyAllAutoReady(true);
                  setBottifyAllErratic(false);
               }
            }}
         >
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>{t('bottifyAllPlayers')}</DialogTitle>
                  <DialogDescription>{t('bottifyAllPlayersDescription', { count: bottifiablePlayerRows.length })}</DialogDescription>
               </DialogHeader>
               <CheckboxRow
                  label={t('bottifyAutoReady')}
                  checked={bottifyAllAutoReady}
                  onCheckedChangeAction={setBottifyAllAutoReady}
                  disabled={bottifyAllMutation.isPending}
               />
               <CheckboxRow
                  label={t('bottifyErratic')}
                  checked={bottifyAllErratic}
                  onCheckedChangeAction={setBottifyAllErratic}
                  disabled={bottifyAllMutation.isPending}
               />
               <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setBottifyAllOpen(false)} disabled={bottifyAllMutation.isPending}>
                     {tc('cancel')}
                  </Button>
                  <Button type="button" onClick={submitBottifyAll} disabled={bottifyAllMutation.isPending || bottifiablePlayerRows.length === 0}>
                     {bottifyAllMutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                     {t('bottifyAllPlayers')}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         <ConfirmDialog
            open={startConfirmOpen}
            onOpenChangeAction={setStartConfirmOpen}
            title={t('startMapNotReadyTitle')}
            description={t('startMapNotReadyDescription', { count: unreadyPlayerRows.length })}
            confirmLabel={t('startAnyway')}
            pending={startMutation.isPending}
            onConfirmAction={startMap}
         >
            <div className="flex flex-col gap-2">
               <p className="text-sm font-medium">{t('startMapNotReadyPlayers')}</p>
               <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto text-sm">
                  {unreadyPlayerRows.map((player) => (
                     <li key={player.playerId} className="flex min-w-0 items-center justify-between gap-3 rounded-md border px-3 py-2">
                        <div className="min-w-0 flex-1">
                           <LivePlayerCell player={player.player} unknownLabel={t('unknownPlayer')} isBot={player.isBot} />
                        </div>
                        <span className="text-muted-foreground shrink-0">{player.readyState === 'AFK' ? t('afk') : t('notReady')}</span>
                     </li>
                  ))}
               </ul>
            </div>
         </ConfirmDialog>

         <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChangeAction={setDeleteDialogOpen}
            title={t('deleteRoom')}
            description={t('deleteRoomDescription', { room: room.matchId })}
            confirmLabel={t('deleteRoom')}
            variant="destructive"
            pending={deleteMutation.isPending}
            confirmationText={room.matchId}
            onConfirmAction={removeRoom}
         />

         <LiveSongSelectDialog
            open={songDialogOpen}
            pending={songMutation.isPending}
            onOpenChangeAction={setSongDialogOpen}
            onSelectAction={changeSong}
         />

         <LiveTournamentPlayerSelectDialog
            open={playerPickerOpen}
            onOpenChangeAction={setPlayerPickerOpen}
            onSelectAction={addPlayer}
            players={authorizedPlayers}
            disabledPlayerIds={roomPlayers.map((player) => player.playerId)}
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
      </div>
   );
}

function getRoomPlayerDrafts(members: RoomMember[], authorizedPlayers: LiveTournamentRosterControllerListAuthorizedPlayersItem[]): RoomPlayerDraft[] {
   const authorizedPlayersById = new Map(authorizedPlayers.map((player) => [player.playerId, player]));

   return members.flatMap((member) => {
      if (member.role !== 'PLAYER') return [];
      const authorizedPlayer = authorizedPlayersById.get(member.playerId);

      return [
         {
            playerId: member.playerId,
            player: authorizedPlayer?.player ?? null,
            teamName: authorizedPlayer?.teamName ?? null,
            role: 'PLAYER',
            active: member.active ?? true
         }
      ];
   });
}

function compareLudusChatMessages(left: LudusChatMessage, right: LudusChatMessage) {
   const diff = BigInt(left.roomSequence || '0') - BigInt(right.roomSequence || '0');
   if (diff < 0n) return -1;
   if (diff > 0n) return 1;
   return 0;
}

function toRoomPlayerDraft(player: LiveTournamentRosterControllerListAuthorizedPlayersItem): RoomPlayerDraft {
   return {
      playerId: player.playerId,
      player: player.player,
      teamName: player.teamName,
      role: 'PLAYER',
      active: true
   };
}

function toRoomMemberPayload(players: RoomPlayerDraft[], currentMembers: RoomMember[]) {
   const playerIds = new Set(players.map((player) => player.playerId));

   return [
      ...players.map((player) => ({
         playerId: player.playerId,
         role: player.role
      })),
      ...currentMembers.flatMap((member) => {
         if (member.role === 'PLAYER' || playerIds.has(member.playerId)) return [];

         return [
            {
               playerId: member.playerId,
               role: member.role
            }
         ];
      })
   ];
}

function getActivePlayerIds(players: RoomPlayerDraft[]) {
   return players.flatMap((player) => (player.active ? [player.playerId] : []));
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

function getPromptResponsesByPlayer(matchId: string, responses: LudusPromptResponses) {
   const responsesByPlayer = new Map<string, LudusPromptResponses>();

   for (const response of responses) {
      if (response.matchId === matchId) {
         responsesByPlayer.set(response.playerId, [...(responsesByPlayer.get(response.playerId) ?? []), response]);
      }
   }

   for (const [playerId, playerResponses] of responsesByPlayer) {
      responsesByPlayer.set(
         playerId,
         playerResponses.toSorted((left, right) => right.respondedAtUnixMs - left.respondedAtUnixMs)
      );
   }

   return responsesByPlayer;
}

function getRoomPlayerName(player: LiveRoomPlayerListRow) {
   const name = player.player?.name ?? 'Player';
   return player.isBot ? `${name} [BOT]` : name;
}

function getLivePlayerArcviewerUrl(player: LiveRoomPlayerListRow, tournamentId: string, ludusRoom: LudusRoom | null) {
   if (!ludusRoom || !player.member?.connected || (player.playState !== 'PLAYING' && player.playState !== 'IN_GAME')) return null;

   return getArcviewerUrl({
      playerId: player.member.playerId,
      tournamentId,
      roomId: ludusRoom.roomId
   });
}

function formatSongPosition(ms: number) {
   if (!Number.isFinite(ms)) return '-';
   const seconds = Math.max(0, Math.floor(ms / 1000));
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = seconds % 60;
   return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
