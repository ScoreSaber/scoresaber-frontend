import { useTranslations } from 'use-intl';

import { HomeColumnEmptyCard } from './home-column';

import { RankingCard } from '@/modules/rankings/rankings-table';
import type { PlayerControllerGetPlayersDataItem } from '@/shared/api/generated/ApiParams';

export function TopPlayersColumn({ players }: { players: PlayerControllerGetPlayersDataItem[] }) {
   const t = useTranslations('home');

   if (players.length === 0) {
      return <HomeColumnEmptyCard>{t('empty.players')}</HomeColumnEmptyCard>;
   }

   return (
      <div className="flex min-h-0 flex-1 flex-col gap-2">
         {players.map((player, index) => (
            <RankingCard
               key={player.id}
               player={player}
               countryFiltered={false}
               isDefaultSort
               listPosition={index + 1}
               variant="summary"
               className="flex-1 justify-center border-white/20"
            />
         ))}
      </div>
   );
}
