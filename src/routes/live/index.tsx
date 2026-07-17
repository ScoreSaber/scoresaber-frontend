import { useState, type FormEvent } from 'react';

import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { ArrowRight, Plus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { createLiveTournament } from '@/modules/live/actions/admin';
import { StatusBadge } from '@/modules/live/components/live-ui';
import { canUseLivePlatform } from '@/modules/live/lib/permissions';
import type { LiveTournamentControllerCreateTournamentResponse, LiveTournamentControllerListTournamentsItem } from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { cn } from '@/shared/format/helpers';
import { optionalApiData } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getLiveIndexData = createServerFn({ method: 'GET' }).handler(async () => ({
   tournaments: (await optionalApiData(api.livePlatform.liveTournamentControllerListTournaments())) ?? []
}));

export const Route = createFileRoute('/live/')({
   loader: () => getLiveIndexData(),
   head: () => buildNoindexHead('Live Platform', 'Operate ScoreSaber live tournaments', '/live'),
   component: LiveIndexRoute
});

function LiveIndexRoute() {
   const t = useTranslations('live');
   const ts = useTranslations('sidebar');
   const { user } = useAuth();
   const router = useRouter();
   const data = Route.useLoaderData();
   const [createOpen, setCreateOpen] = useState(false);
   const [name, setName] = useState('');
   const mutation = useActionMutation<LiveTournamentControllerCreateTournamentResponse>();
   const canCreate = canUseLivePlatform(user?.permissions);

   function submitCreateTournament(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const tournamentName = name.trim();
      if (!tournamentName) return;

      mutation.run(
         () => createLiveTournament({ name: tournamentName }),
         t('createTournamentSuccess'),
         t('createTournamentFailed'),
         (tournament) => {
            setCreateOpen(false);
            setName('');
            void router.navigate({ to: '/live/$tournamentId/settings', params: { tournamentId: tournament.tournamentId } });
         }
      );
   }

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <div className="relative z-10 flex min-h-dvh flex-1 items-center justify-center overflow-hidden px-4 pt-10 pb-28">
            <section className="flex w-full max-w-lg flex-col gap-5">
               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="text-center text-2xl font-semibold text-balance sm:text-left">{t('selectorTitle')}</h1>

                  {canCreate && (
                     <Button className="w-fit cursor-pointer self-center sm:self-auto" onClick={() => setCreateOpen(true)}>
                        <Plus data-icon />
                        {t('createTournament')}
                     </Button>
                  )}
               </div>

               {!user ? (
                  <Button asChild className="w-fit self-center">
                     <Link to="/login" search={{ redirectTo: '/live' }}>
                        {ts('logIn')}
                        <ArrowRight data-icon />
                     </Link>
                  </Button>
               ) : data.tournaments.length > 0 ? (
                  <div className="flex flex-col gap-2">
                     {data.tournaments.map((tournament) => (
                        <TournamentRow key={tournament.tournamentId} tournament={tournament} />
                     ))}
                  </div>
               ) : (
                  <p className="text-muted-foreground text-center text-sm">{t('noTournaments')}</p>
               )}
            </section>
         </div>

         <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{t('createTournamentDialogTitle')}</DialogTitle>
               </DialogHeader>
               <form className="flex flex-col gap-4" onSubmit={submitCreateTournament}>
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="live-tournament-name">{t('name')}</Label>
                     <Input
                        id="live-tournament-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={t('tournamentNamePlaceholder')}
                        autoComplete="off"
                     />
                  </div>
                  <DialogFooter>
                     <Button type="submit" className="cursor-pointer" disabled={!name.trim() || mutation.isPending}>
                        <Plus data-icon />
                        {t('createTournament')}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </>
   );
}

function TournamentRow({ tournament }: { tournament: LiveTournamentControllerListTournamentsItem }) {
   return (
      <Link
         to="/live/$tournamentId/settings"
         params={{ tournamentId: tournament.tournamentId }}
         className={cn(
            'bg-background/70 hover:bg-background/90 group flex min-w-0 items-center justify-between gap-3 rounded-md border px-4 py-3 shadow-sm transition-colors',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-hidden'
         )}
      >
         <span className="truncate font-medium">{tournament.name}</span>
         <span className="flex shrink-0 items-center gap-2">
            <StatusBadge value={tournament.status} />
            <ArrowRight data-icon className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
         </span>
      </Link>
   );
}
