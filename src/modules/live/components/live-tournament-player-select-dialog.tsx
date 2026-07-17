'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { LivePlayerCell } from '@/modules/live/components/live-room-player-list';
import { LiveActionHeader, LiveRowActions, LiveTableShell } from '@/modules/live/components/live-ui';
import type { LiveTournamentRosterControllerListAuthorizedPlayersItem } from '@/shared/api/generated/ApiParams';

export function LiveTournamentPlayerSelectDialog({
   open,
   onOpenChangeAction,
   players,
   title,
   onSelectAction,
   disabledPlayerIds = []
}: {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   players: LiveTournamentRosterControllerListAuthorizedPlayersItem[];
   title: string;
   onSelectAction: (player: LiveTournamentRosterControllerListAuthorizedPlayersItem) => void;
   disabledPlayerIds?: string[];
}) {
   const t = useTranslations('live');
   const tc = useTranslations('common');
   const [query, setQuery] = useState('');
   const disabledIds = useMemo(() => new Set(disabledPlayerIds), [disabledPlayerIds]);
   const filteredPlayers = players.filter((player) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      const playerId = player.playerId;
      return (
         playerId.includes(needle) ||
         (player.player?.name.toLowerCase().includes(needle) ?? false) ||
         (player.teamName?.toLowerCase().includes(needle) ?? false)
      );
   });

   return (
      <Dialog
         open={open}
         onOpenChange={(nextOpen) => {
            onOpenChangeAction(nextOpen);
            if (!nextOpen) setQuery('');
         }}
      >
         <DialogContent className="h-dvh max-h-dvh max-w-none overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-lg sm:border">
            <div className="flex h-full min-h-0 flex-col gap-4 p-6">
               <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>
               <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('filterPlayers')} />
               <LiveTableShell className="sm:max-h-72">
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
                           filteredPlayers.map((player) => {
                              const playerId = player.playerId;
                              const disabled = disabledIds.has(playerId);
                              return (
                                 <TableRow key={playerId} className="group/row">
                                    <TableCell className="min-w-56">
                                       <LivePlayerCell player={player.player} unknownLabel={t('unknownPlayer')} />
                                    </TableCell>
                                    <TableCell>{player.teamName ?? t('noTeam')}</TableCell>
                                    <TableCell className="text-right">
                                       <LiveRowActions>
                                          <Button
                                             type="button"
                                             variant="outline"
                                             size="sm"
                                             onClick={() => onSelectAction(player)}
                                             disabled={disabled}
                                          >
                                             {disabled ? t('added') : t('addPlayer')}
                                          </Button>
                                       </LiveRowActions>
                                    </TableCell>
                                 </TableRow>
                              );
                           })
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
            </div>
         </DialogContent>
      </Dialog>
   );
}
