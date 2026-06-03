'use client';

import { useState } from 'react';

import { FaClock, FaTrophy } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import type { PlayerControllerGetPlayerScoresSort } from '@/shared/api/generated/ApiParams';
import { DebouncedSearchInput } from '@/shared/components/debounced-search-input';
import { Icons } from '@/shared/components/icons';
import { cn } from '@/shared/format/helpers';
import { usePersistedParams } from '@/shared/url-state/persisted/use-persisted-params';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';

type PlayerScoresSearch = SearchParamsRecord & {
   page?: number;
   sort?: PlayerControllerGetPlayerScoresSort;
   search?: string;
};

export function PlayerScoresToolbar({
   search,
   buildHref,
   parseSearch,
   className
}: {
   search: PlayerScoresSearch;
   buildHref: (search?: PlayerScoresSearch) => string;
   parseSearch: (search: SearchParamsRecord) => PlayerScoresSearch | null;
   className?: string;
}) {
   const t = useTranslations();
   const tc = useTranslations();
   const { navigate, preload, cancelPreload } = usePersistedParams({
      storageKey: 'player-scores-toolbar',
      search,
      buildHref,
      parseSearch
   });
   const currentSort = search.sort ?? 'top';
   const currentSearch = search.search;

   const [newSort, setNewSort] = useState<PlayerControllerGetPlayerScoresSort>(currentSort);

   const loading = newSort !== currentSort;
   const topLoading = loading && newSort === 'top';
   const recentLoading = loading && newSort === 'recent';

   function handleSearch(value: string | undefined) {
      navigate({ search: value }, { scroll: false });
   }

   function handleSort(sort: PlayerControllerGetPlayerScoresSort) {
      setNewSort(sort);
      navigate({ sort }, { scroll: false });
   }

   return (
      <div className={cn('flex w-88 flex-col items-center gap-3 text-sm', className)}>
         <div className="flex gap-2">
            <Button
               disabled={loading}
               onMouseEnter={() => preload({ sort: 'top' }, { scroll: false })}
               onFocus={() => preload({ sort: 'top' }, { scroll: false })}
               onMouseLeave={cancelPreload}
               onBlur={cancelPreload}
               onClick={() => handleSort('top')}
               size="sm"
               variant={currentSort === 'top' ? 'default' : 'secondary'}
               className="cursor-pointer"
            >
               {!topLoading ? <FaTrophy data-icon="inline-start" /> : <Icons.spinner data-icon="inline-start" className="animate-spin" />}
               {t('player.topScores')}
            </Button>

            <Button
               disabled={loading}
               onMouseEnter={() => preload({ sort: 'recent' }, { scroll: false })}
               onFocus={() => preload({ sort: 'recent' }, { scroll: false })}
               onMouseLeave={cancelPreload}
               onBlur={cancelPreload}
               onClick={() => handleSort('recent')}
               size="sm"
               variant={currentSort === 'recent' ? 'default' : 'secondary'}
               className="cursor-pointer"
            >
               {!recentLoading ? <FaClock data-icon="inline-start" /> : <Icons.spinner data-icon="inline-start" className="animate-spin" />}
               {t('player.recentScores')}
            </Button>
         </div>

         {/* search */}
         <DebouncedSearchInput
            id="score-search"
            initialValue={currentSearch ?? ''}
            placeholder={t('player.searchScoresPlaceholder')}
            clearLabel={tc('common.clearSearch')}
            srLabel={t('player.searchScores')}
            onSearchAction={handleSearch}
         />
      </div>
   );
}
