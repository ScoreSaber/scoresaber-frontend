'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { Loader2, Pencil, Plus, Save, Trash2, Users } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { deleteLiveTeam, upsertLiveTeam } from '@/modules/live/actions/admin';
import { FormField, LiveActionHeader, LiveRowActions, LiveSection, LiveTableShell } from '@/modules/live/components/live-ui';
import type { LiveTournamentRosterControllerListTeamsItem, LiveTournamentRosterControllerUpsertTeamResponse } from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';

type TeamDraft = {
   id?: number;
   name: string;
};

export function LiveTeamsPanel({ tournamentId, teams }: { tournamentId: string; teams: LiveTournamentRosterControllerListTeamsItem[] }) {
   const t = useTranslations('live');
   const mutation = useActionMutation<LiveTournamentRosterControllerUpsertTeamResponse>();
   const deleteMutation = useActionMutation();
   const [teamRows, setTeamRows] = useState(teams);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [deleteCandidate, setDeleteCandidate] = useState<LiveTournamentRosterControllerListTeamsItem | null>(null);
   const [draft, setDraft] = useState<TeamDraft>({ name: '' });
   const [query, setQuery] = useState('');
   const pending = mutation.isPending || deleteMutation.isPending;
   const filteredTeams = useMemo(() => {
      const needle = query.trim().toLowerCase();
      if (!needle) return teamRows;

      return teamRows.filter((team) => team.name.toLowerCase().includes(needle));
   }, [query, teamRows]);

   useEffect(() => {
      setTeamRows(teams);
   }, [teams]);

   function openCreate() {
      setDraft({ name: '' });
      setDialogOpen(true);
   }

   function openEdit(team: LiveTournamentRosterControllerListTeamsItem) {
      setDraft({ id: team.id, name: team.name });
      setDialogOpen(true);
   }

   function saveTeam(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const name = draft.name.trim();
      if (!name) return;

      mutation.run(
         () =>
            upsertLiveTeam(tournamentId, {
               id: draft.id,
               name
            }),
         t('teamSaved'),
         t('teamSaveFailed'),
         (team) => {
            setTeamRows((current) => {
               const existing = current.some((row) => row.id === team.id);
               const next = existing ? current.map((row) => (row.id === team.id ? team : row)) : [...current, team];
               return next.toSorted((left, right) => left.name.localeCompare(right.name));
            });
            setDialogOpen(false);
         }
      );
   }

   function removeTeam() {
      if (!deleteCandidate) return;

      deleteMutation.run(
         () => deleteLiveTeam(tournamentId, deleteCandidate.id),
         t('teamDeleted'),
         t('teamDeleteFailed'),
         () => {
            setTeamRows((current) => current.filter((row) => row.id !== deleteCandidate.id));
            setDeleteCandidate(null);
         }
      );
   }

   return (
      <>
         <LiveSection
            title={t('teams')}
            icon={<Users data-icon />}
            actions={
               <Button className="w-fit cursor-pointer" onClick={openCreate} disabled={pending}>
                  <Plus data-icon="inline-start" />
                  {t('addTeam')}
               </Button>
            }
         >
            <div className="flex min-w-0 flex-col gap-2 sm:max-w-sm">
               <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('filterTeams')} />
            </div>
            <LiveTableShell className="max-h-[32rem]">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead className="w-0 text-right">
                           <LiveActionHeader label={t('actions')} />
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredTeams.length > 0 ? (
                        filteredTeams.map((team) => (
                           <TableRow key={team.id} className="group/row">
                              <TableCell className="font-medium">{team.name}</TableCell>
                              <TableCell className="text-right">
                                 <LiveRowActions>
                                    <Button
                                       type="button"
                                       variant="ghost"
                                       size="icon-sm"
                                       className="cursor-pointer"
                                       onClick={() => openEdit(team)}
                                       disabled={pending}
                                       title={t('editTeam')}
                                    >
                                       <Pencil data-icon />
                                    </Button>
                                    <Button
                                       type="button"
                                       variant="ghost"
                                       size="icon-sm"
                                       className="cursor-pointer"
                                       onClick={() => setDeleteCandidate(team)}
                                       disabled={pending}
                                       title={t('deleteTeam')}
                                    >
                                       <Trash2 data-icon />
                                    </Button>
                                 </LiveRowActions>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={2} className="text-muted-foreground h-20 text-center">
                              {t('noTeams')}
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </LiveTableShell>
         </LiveSection>

         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{draft.id ? t('editTeam') : t('addTeam')}</DialogTitle>
               </DialogHeader>
               <form className="flex flex-col gap-4" onSubmit={saveTeam}>
                  <FormField id="live-team-name" label={t('name')}>
                     <Input
                        id="live-team-name"
                        value={draft.name}
                        onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                     />
                  </FormField>
                  <DialogFooter>
                     <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)} disabled={pending}>
                        {t('cancel')}
                     </Button>
                     <Button type="submit" className="cursor-pointer" disabled={pending || !draft.name.trim()}>
                        {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save data-icon="inline-start" />}
                        {t('saveTeam')}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>

         <ConfirmDialog
            open={deleteCandidate != null}
            onOpenChangeAction={(open) => {
               if (!open) setDeleteCandidate(null);
            }}
            title={t('deleteTeam')}
            description={t('deleteTeamDescription', { team: deleteCandidate?.name ?? '' })}
            confirmLabel={t('deleteTeam')}
            variant="destructive"
            pending={deleteMutation.isPending}
            onConfirmAction={removeTeam}
         />
      </>
   );
}
