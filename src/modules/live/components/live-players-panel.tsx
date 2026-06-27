'use client';

import { useEffect, useMemo, useState } from 'react';

import { Result } from 'better-result';
import { Download, Loader2, Save, Trash2, Upload, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { DirtyNavigationBlocker } from '@/hooks/use-dirty-navigation-blocker';
import { syncLiveAuthorizedPlayers, upsertLiveTeam } from '@/modules/live/actions/admin';
import { LivePlayerCsvExportDialog, LivePlayerCsvImportDialog, type LivePlayerCsvRow } from '@/modules/live/components/live-player-csv-dialog';
import { LivePlayerCell } from '@/modules/live/components/live-room-player-list';
import { LiveActionHeader, LiveRowActions, LiveSection, LiveTableShell } from '@/modules/live/components/live-ui';
import { PlayerPickerDialog, type PlayerPickerSelection } from '@/modules/player/shared/player-picker-dialog';
import type {
   LiveTournamentRosterControllerListAuthorizedPlayersItem,
   LiveTournamentRosterControllerListTeamsItem,
   LiveTournamentRosterControllerSyncAuthorizedPlayersResponse
} from '@/shared/api/generated/ApiParams';

type AuthorizedPlayerIdentity = NonNullable<LiveTournamentRosterControllerListAuthorizedPlayersItem['player']>;

type AuthorizedPlayerDraft = {
   playerId: string;
   player: AuthorizedPlayerIdentity | null;
   teamId: number | null;
   teamName: string | null;
};

export function LivePlayersPanel({
   tournamentId,
   authorizedPlayers,
   teams
}: {
   tournamentId: string;
   authorizedPlayers: LiveTournamentRosterControllerListAuthorizedPlayersItem[];
   teams: LiveTournamentRosterControllerListTeamsItem[];
}) {
   const t = useTranslations('live');
   const tc = useTranslations('common');
   const mutation = useActionMutation<LiveTournamentRosterControllerSyncAuthorizedPlayersResponse>();
   const [teamRows, setTeamRows] = useState(teams);
   const [savedPlayers, setSavedPlayers] = useState(() => authorizedPlayers.map(toDraftPlayer));
   const [players, setPlayers] = useState(savedPlayers);
   const [pickerOpen, setPickerOpen] = useState(false);
   const [importOpen, setImportOpen] = useState(false);
   const [exportOpen, setExportOpen] = useState(false);
   const [importPending, setImportPending] = useState(false);
   const [query, setQuery] = useState('');
   const [teamFilter, setTeamFilter] = useState('all');
   const pending = mutation.isPending || importPending;
   const isDirty = getPlayersFingerprint(players) !== getPlayersFingerprint(savedPlayers);
   const filteredPlayers = useMemo(() => {
      const needle = query.trim().toLowerCase();

      return players.filter(
         (player) =>
            (teamFilter === 'all' || (teamFilter === 'none' ? player.teamId == null : player.teamId === Number(teamFilter))) &&
            (!needle ||
               player.playerId.includes(needle) ||
               (player.player?.name.toLowerCase().includes(needle) ?? false) ||
               (player.teamName?.toLowerCase().includes(needle) ?? false))
      );
   }, [players, query, teamFilter]);

   useEffect(() => {
      const nextPlayers = authorizedPlayers.map(toDraftPlayer);
      setSavedPlayers(nextPlayers);
      setPlayers(nextPlayers);
   }, [authorizedPlayers]);

   useEffect(() => {
      setTeamRows(teams);
   }, [teams]);

   useEffect(() => {
      const validTeamIds = new Set(teamRows.map((team) => team.id));
      setPlayers((current) =>
         current.map((player) => (player.teamId != null && !validTeamIds.has(player.teamId) ? { ...player, teamId: null, teamName: null } : player))
      );
   }, [teamRows]);

   function addPlayer(selection: PlayerPickerSelection) {
      const playerId = selection.publicPlayerId;
      if (players.some((player) => player.playerId === playerId)) {
         toast.error(t('playerAlreadyAuthorized'));
         return;
      }

      setPlayers((current) => [
         ...current,
         {
            playerId,
            player: selection.player,
            teamId: null,
            teamName: null
         }
      ]);
   }

   async function importPlayers(rows: LivePlayerCsvRow[]) {
      setImportPending(true);
      const importResult = Result.tapBoth(await Result.tryPromise(() => importPlayerRows(rows)), {
         ok: () => setImportPending(false),
         err: () => setImportPending(false)
      });

      return Result.match(importResult, {
         ok: (success) => success,
         err: () => {
            toast.error(t('playersSaveFailed'));
            return false;
         }
      });
   }

   async function importPlayerRows(rows: LivePlayerCsvRow[]) {
      const teamsByName = new Map(teamRows.map((team) => [team.name.toLowerCase(), team]));
      const nextTeams = [...teamRows];

      for (const teamName of getMissingTeamNames(rows, teamsByName)) {
         const result = await upsertLiveTeam(tournamentId, { name: teamName });
         if (!result.ok) {
            toast.error(result.error || t('teamSaveFailed'));
            return false;
         }

         teamsByName.set(result.value.name.toLowerCase(), result.value);
         nextTeams.push(result.value);
      }

      if (nextTeams.length !== teamRows.length) {
         setTeamRows(nextTeams.toSorted((left, right) => left.name.localeCompare(right.name)));
      }

      const imported = rows.map((row) => {
         const team = row.teamName ? teamsByName.get(row.teamName.toLowerCase()) : null;

         return {
            playerId: row.playerId,
            player: null,
            teamId: team?.id ?? null,
            teamName: team?.name ?? null
         };
      });

      setPlayers((current) => {
         const byId = new Map(current.map((player) => [player.playerId, player]));
         for (const player of imported) {
            const existing = byId.get(player.playerId);
            byId.set(player.playerId, existing ? { ...existing, teamId: player.teamId, teamName: player.teamName } : player);
         }

         return [...byId.values()];
      });

      return true;
   }

   function removePlayer(playerId: string) {
      setPlayers((current) => current.filter((player) => player.playerId !== playerId));
   }

   function setPlayerTeam(playerId: string, teamValue: string) {
      const team = teamValue === 'none' ? null : teamRows.find((row) => row.id === Number(teamValue));
      setPlayers((current) =>
         current.map((player) =>
            player.playerId === playerId
               ? {
                    ...player,
                    teamId: team?.id ?? null,
                    teamName: team?.name ?? null
                 }
               : player
         )
      );
   }

   function savePlayers() {
      mutation.run(
         () =>
            syncLiveAuthorizedPlayers(tournamentId, {
               players: players.map((player) => ({
                  playerId: player.playerId,
                  teamId: player.teamId
               }))
            }),
         t('playersSaved'),
         t('playersSaveFailed'),
         (result) => {
            const skippedCount = Math.max(0, players.length - result.players.length);
            if (skippedCount > 0) toast.warning(t('playersSkippedMissing', { count: skippedCount }));

            const nextPlayers = result.players.map(toDraftPlayer);
            setSavedPlayers(nextPlayers);
            setPlayers(nextPlayers);
         }
      );
   }

   return (
      <>
         <LiveSection
            title={t('authorizedPlayers')}
            icon={<Users data-icon />}
            actions={
               <>
                  <Button className="w-fit cursor-pointer" variant="outline" onClick={() => setImportOpen(true)} disabled={pending}>
                     <Upload data-icon="inline-start" />
                     {t('importCsv')}
                  </Button>
                  <Button className="w-fit cursor-pointer" variant="outline" onClick={() => setExportOpen(true)} disabled={pending}>
                     <Download data-icon="inline-start" />
                     {t('exportCsv')}
                  </Button>
                  <Button className="w-fit cursor-pointer" variant="outline" onClick={() => setPickerOpen(true)} disabled={pending}>
                     <UserPlus data-icon="inline-start" />
                     {t('addPlayer')}
                  </Button>
                  <Button className="w-fit cursor-pointer" onClick={savePlayers} disabled={pending || !isDirty}>
                     {pending ? <Loader2 className="animate-spin" /> : <Save data-icon="inline-start" />}
                     {t('saveChanges')}
                  </Button>
               </>
            }
         >
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_14rem] lg:max-w-2xl">
               <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('filterPlayers')} />
               <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="cursor-pointer">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">{t('allTeams')}</SelectItem>
                     <SelectItem value="none">{t('noTeam')}</SelectItem>
                     {teamRows.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                           {team.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <LiveTableShell className="max-h-[32rem]">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>{t('player')}</TableHead>
                        <TableHead>{t('team')}</TableHead>
                        <TableHead className="w-0 text-right">
                           <LiveActionHeader label={tc('actions')} />
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player) => (
                           <TableRow key={player.playerId} className="group/row">
                              <TableCell className="min-w-56">
                                 <LivePlayerCell player={player.player} unknownLabel={t('unknownPlayer')} />
                              </TableCell>
                              <TableCell>
                                 <Select value={player.teamId?.toString() ?? 'none'} onValueChange={(value) => setPlayerTeam(player.playerId, value)}>
                                    <SelectTrigger className="min-w-36">
                                       <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="none">{t('noTeam')}</SelectItem>
                                       {teamRows.map((team) => (
                                          <SelectItem key={team.id} value={team.id.toString()}>
                                             {team.name}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                 <LiveRowActions>
                                    <Button
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
                           <TableCell colSpan={3} className="text-muted-foreground h-20 text-center">
                              {t('noAuthorizedPlayers')}
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </LiveTableShell>
         </LiveSection>

         <PlayerPickerDialog
            open={pickerOpen}
            onOpenChangeAction={setPickerOpen}
            onSelectAction={addPlayer}
            title={t('addAuthorizedPlayer')}
            description={t('addAuthorizedPlayerDescription')}
         />
         <LivePlayerCsvImportDialog
            open={importOpen}
            onOpenChangeAction={setImportOpen}
            title={t('importPlayersCsv')}
            includeTeam
            onImportAction={importPlayers}
         />
         <LivePlayerCsvExportDialog
            open={exportOpen}
            onOpenChangeAction={setExportOpen}
            title={t('exportPlayersCsv')}
            rows={players.map((player) => ({
               playerId: player.playerId,
               displayName: player.player?.name ?? null,
               teamName: player.teamName
            }))}
            includeTeam
            fileName={`${tournamentId}-players.csv`}
         />
         <DirtyNavigationBlocker
            isDirty={isDirty}
            title={t('unsavedChangesTitle')}
            description={t('unsavedChangesConfirm')}
            confirmLabel={t('leaveWithoutSaving')}
         />
      </>
   );
}

function toDraftPlayer(player: LiveTournamentRosterControllerListAuthorizedPlayersItem): AuthorizedPlayerDraft {
   return {
      playerId: player.playerId,
      player: player.player,
      teamId: player.teamId,
      teamName: player.teamName
   };
}

function getMissingTeamNames(rows: LivePlayerCsvRow[], teamsByName: Map<string, LiveTournamentRosterControllerListTeamsItem>) {
   const missingTeamNames = new Map<string, string>();
   for (const row of rows) {
      const teamName = row.teamName?.trim();
      if (!teamName) continue;

      const key = teamName.toLowerCase();
      if (!teamsByName.has(key) && !missingTeamNames.has(key)) {
         missingTeamNames.set(key, teamName);
      }
   }

   return [...missingTeamNames.values()];
}

function getPlayersFingerprint(players: AuthorizedPlayerDraft[]) {
   return JSON.stringify(
      players
         .map((player) => ({
            playerId: player.playerId,
            teamId: player.teamId
         }))
         .toSorted((left, right) => left.playerId.localeCompare(right.playerId))
   );
}
