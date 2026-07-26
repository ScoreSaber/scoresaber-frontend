import { useTranslations } from 'use-intl';

import { HomeColumnEmptyCard } from './home-column';

import { MapCard } from '@/modules/maps/listing/map-card';
import type { MapControllerGetMapListingsDataItem } from '@/shared/api/generated/ApiParams';

export function TrendingMapsColumn({ maps }: { maps: MapControllerGetMapListingsDataItem[] }) {
   const t = useTranslations('home');

   if (maps.length === 0) {
      return <HomeColumnEmptyCard>{t('empty.maps')}</HomeColumnEmptyCard>;
   }

   return (
      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
         {maps.map((map, index) => (
            <MapCard
               key={map.id}
               map={map}
               compact
               variant="home"
               background="transparent"
               coverPriority={index === 0}
               className="min-h-0 flex-1 rounded-lg border-white/20"
            />
         ))}
      </div>
   );
}
