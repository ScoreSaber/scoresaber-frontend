'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { LiveActionHeader, LiveRowActions, LiveTableShell } from '@/modules/live/components/live-ui';
import type { LiveTournamentRosterControllerListTeamsItem } from '@/shared/api/generated/ApiParams';

export function LiveTournamentTeamSelectDialog({
   open,
   onOpenChangeAction,
   teams,
   title,
   onSelectAction,
   disabledTeamIds = []
}: {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   teams: LiveTournamentRosterControllerListTeamsItem[];
   title: string;
   onSelectAction: (team: LiveTournamentRosterControllerListTeamsItem) => void;
   disabledTeamIds?: number[];
}) {
   const t = useTranslations('live');
   const tc = useTranslations('common');
   const [query, setQuery] = useState('');
   const disabledIds = useMemo(() => new Set(disabledTeamIds), [disabledTeamIds]);
   const filteredTeams = teams.filter((team) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return team.name.toLowerCase().includes(needle);
   });

   function selectTeam(team: LiveTournamentRosterControllerListTeamsItem) {
      onSelectAction(team);
   }

   return (
      <Dialog
         open={open}
         onOpenChange={(nextOpen) => {
            onOpenChangeAction(nextOpen);
            if (!nextOpen) setQuery('');
         }}
      >
         <DialogContent className="h-dvh max-h-dvh max-w-none overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-md sm:rounded-lg sm:border">
            <div className="flex h-full min-h-0 flex-col gap-4 p-6">
               <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>
               <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('filterTeams')} />
               <LiveTableShell className="sm:max-h-96">
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>{t('team')}</TableHead>
                           <TableHead className="w-0 text-right">
                              <LiveActionHeader label={tc('actions')} />
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredTeams.length > 0 ? (
                           filteredTeams.map((team) => {
                              const disabled = disabledIds.has(team.id);
                              return (
                                 <TableRow key={team.id} className="group/row">
                                    <TableCell className="font-medium">{team.name}</TableCell>
                                    <TableCell className="text-right">
                                       <LiveRowActions>
                                          <Button type="button" variant="outline" size="sm" onClick={() => selectTeam(team)} disabled={disabled}>
                                             {disabled ? t('added') : t('addTeam')}
                                          </Button>
                                       </LiveRowActions>
                                    </TableCell>
                                 </TableRow>
                              );
                           })
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
            </div>
         </DialogContent>
      </Dialog>
   );
}
