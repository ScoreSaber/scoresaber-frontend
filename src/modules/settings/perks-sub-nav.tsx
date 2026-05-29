'use client';

import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Medal, Sparkles, Video } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuth } from '@/modules/auth';
import { canRedeemScoreSaber2Badge, hasScoreSaber2Badge } from '@/modules/settings/perks/score-saber-2-badge';
import { buildSettingsPerksHref, PERKS_SUB_TABS, type PerksSubTab } from '@/modules/settings/settings-tabs';
import { api } from '@/shared/api/ApiInstance';
import { queryApiData } from '@/shared/result/api';
import { toInt64PathParam } from '@/shared/url-state/params';

const TAB_ICONS: Record<PerksSubTab, React.ReactNode> = {
   overview: <Sparkles className="size-3" />,
   replays: <Video className="size-3" />,
   'score-saber-2-badge': <Medal className="size-3" />
};

export function PerksSubNav({ activeSubTab, children }: { activeSubTab: PerksSubTab; children: React.ReactNode }) {
   const t = useTranslations();
   const { user } = useAuth();
   const canRedeem = user ? canRedeemScoreSaber2Badge(user.permissions) : false;
   const playerQuery = useQuery({
      queryKey: ['score-saber-2-badge-player', user?.id],
      queryFn: () => queryApiData(api.player.playerControllerGetPlayer({ id: toInt64PathParam(user?.id ?? '') })),
      enabled: Boolean(user && canRedeem),
      staleTime: 5 * 60 * 1000
   });
   const showRedeemTab =
      activeSubTab === 'score-saber-2-badge' || Boolean(user && canRedeem && playerQuery.isSuccess && !hasScoreSaber2Badge(playerQuery.data));
   const visibleTabs = PERKS_SUB_TABS.filter((tab) => tab !== 'score-saber-2-badge' || showRedeemTab);

   return (
      <Tabs value={activeSubTab} orientation="vertical" className="gap-4 md:gap-6">
         <TabsList variant="sidebar" className="md:w-44">
            {visibleTabs.map((tab) => (
               <TabsTrigger key={tab} value={tab} className="h-auto min-h-8 text-left leading-snug whitespace-normal" asChild>
                  <Link to={buildSettingsPerksHref(tab)} resetScroll={false}>
                     {TAB_ICONS[tab]}
                     <span className="min-w-0 break-words">
                        {tab === 'overview'
                           ? t('settings.perks.tabs.overview')
                           : tab === 'replays'
                             ? t('settings.perks.tabs.replays')
                             : t('settings.perks.tabs.scoreSaber2Badge')}
                     </span>
                  </Link>
               </TabsTrigger>
            ))}
         </TabsList>
         <div className="min-w-0 flex-1">{children}</div>
      </Tabs>
   );
}
