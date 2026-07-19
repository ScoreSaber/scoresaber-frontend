'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

import { FaClock, FaTrophy } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useDenyahMode } from '@/modules/player/denyah/denyah-mode-context';
import { Runaway } from '@/modules/player/denyah/runaway';
import { getProfileAccentProperties, type PlayerProfileCustomizationStyle } from '@/modules/player/profile/player-profile-accent';
import type { PlayerControllerGetPlayerScoresSort } from '@/shared/api/generated/ApiParams';
import { DebouncedSearchInput } from '@/shared/components/debounced-search-input';
import { Icons } from '@/shared/components/icons';
import { cn } from '@/shared/format/helpers';
import { usePersistedParams } from '@/shared/url-state/persisted/use-persisted-params';
import type { RouteLocationBuilder } from '@/shared/url-state/route-location';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';

type PlayerScoresSearch = SearchParamsRecord & {
   page?: number;
   sort?: PlayerControllerGetPlayerScoresSort;
   search?: string;
};

export function PlayerScoresToolbar<TLocation>({
   search,
   buildLocation,
   parseSearch,
   customization,
   className
}: {
   search: PlayerScoresSearch;
   buildLocation: RouteLocationBuilder<PlayerScoresSearch, TLocation>;
   parseSearch: (search: SearchParamsRecord) => PlayerScoresSearch | null;
   customization?: PlayerProfileCustomizationStyle | null;
   className?: string;
}) {
   const t = useTranslations();
   const tc = useTranslations();
   const denyahMode = useDenyahMode();
   const { navigate, preload, cancelPreload } = usePersistedParams({
      storageKey: 'player-scores-toolbar',
      search,
      buildLocation,
      parseSearch
   });
   const currentSort = search.sort ?? 'top';
   const currentSearch = search.search;

   const [newSort, setNewSort] = useState<PlayerControllerGetPlayerScoresSort>(currentSort);

   const loading = newSort !== currentSort;
   const topLoading = loading && newSort === 'top';
   const recentLoading = loading && newSort === 'recent';
   const accentProperties = getProfileAccentProperties(customization);
   const activeSortStyle: CSSProperties = {
      backgroundColor: accentProperties?.['--profile-accent'] ?? 'var(--profile-accent, var(--primary))',
      borderColor: accentProperties?.['--profile-accent'] ?? 'var(--profile-accent, var(--primary))',
      color:
         accentProperties?.['--profile-accent-active-foreground'] ??
         'var(--profile-accent-active-foreground, var(--profile-accent-foreground, var(--primary-foreground)))'
   };
   const inactiveSortStyle: CSSProperties | undefined = accentProperties
      ? {
           color: accentProperties['--profile-accent-foreground']
        }
      : undefined;

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
            <Runaway enabled={denyahMode}>
               <Button
                  disabled={loading}
                  onMouseEnter={() => preload({ sort: 'top' }, { scroll: false })}
                  onFocus={() => preload({ sort: 'top' }, { scroll: false })}
                  onMouseLeave={cancelPreload}
                  onBlur={cancelPreload}
                  onClick={() => handleSort('top')}
                  size="sm"
                  variant={currentSort === 'top' || topLoading ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  style={currentSort === 'top' || topLoading ? activeSortStyle : inactiveSortStyle}
               >
                  {!topLoading ? <FaTrophy data-icon="inline-start" /> : <Icons.spinner data-icon="inline-start" className="animate-spin" />}
                  {t('player.topScores')}
               </Button>
            </Runaway>

            <Runaway enabled={denyahMode}>
               <Button
                  disabled={loading}
                  onMouseEnter={() => preload({ sort: 'recent' }, { scroll: false })}
                  onFocus={() => preload({ sort: 'recent' }, { scroll: false })}
                  onMouseLeave={cancelPreload}
                  onBlur={cancelPreload}
                  onClick={() => handleSort('recent')}
                  size="sm"
                  variant={currentSort === 'recent' || recentLoading ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  style={currentSort === 'recent' || recentLoading ? activeSortStyle : inactiveSortStyle}
               >
                  {!recentLoading ? <FaClock data-icon="inline-start" /> : <Icons.spinner data-icon="inline-start" className="animate-spin" />}
                  {t('player.recentScores')}
               </Button>
            </Runaway>
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
