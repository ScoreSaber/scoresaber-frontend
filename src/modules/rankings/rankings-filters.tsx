'use client';

import { useState } from 'react';

import { FaBroadcastTower, FaChevronDown, FaGlobe, FaTimes, FaUser, FaUserFriends } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useAuth } from '@/modules/auth';
import { useLivePlayersAvailable } from '@/modules/player/profile/player-live-presence-indicator';
import type {
   PlayerControllerGetPlayersPivot,
   PlayerControllerGetPlayersSort,
   PlayerControllerGetPlayersSortDirection
} from '@/shared/api/generated/ApiParams';
import { generateFlagUrl } from '@/shared/components/country-image';
import { CountryRegionFilter } from '@/shared/components/country-region-filter';
import { DebouncedSearchInput } from '@/shared/components/debounced-search-input';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { FilterPill } from '@/shared/components/filter-pill';
import { PaginationArrow } from '@/shared/components/pagination';
import { formatCountryRegionParam, parseCountryRegionParam, type CountryRegionFilterValue } from '@/shared/country-region';
import { cn } from '@/shared/format/helpers';
import { removeStorageValue } from '@/shared/result/storage';
import { rankingFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { usePersistedParams } from '@/shared/url-state/persisted/use-persisted-params';
import type { RouteLocationBuilder } from '@/shared/url-state/route-location';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';

const QUICK_FILTER_BUTTON_CLASS = 'h-8 w-8 cursor-pointer p-0 sm:p-0';

type RankingsFiltersSearch = SearchParamsRecord & {
   page?: number;
   search?: string;
   countries?: CountryRegionFilterValue;
   sort?: PlayerControllerGetPlayersSort;
   sortDirection?: PlayerControllerGetPlayersSortDirection;
   pivot?: PlayerControllerGetPlayersPivot;
   includeInactive?: 'true' | 'false';
   live?: 'true' | 'false';
   highlight?: string;
};

interface RankingsFiltersProps<TLocation> {
   currentPage: number;
   totalPages: number;
   includeInactive: boolean;
   live: boolean;
   search: RankingsFiltersSearch;
   buildLocation: RouteLocationBuilder<RankingsFiltersSearch, TLocation>;
   parseSearch: (search: SearchParamsRecord) => RankingsFiltersSearch | null;
   initialFiltersOpen: boolean;
}

export function RankingsFilters<TLocation>({
   currentPage,
   totalPages,
   includeInactive,
   live,
   search,
   buildLocation,
   parseSearch,
   initialFiltersOpen
}: RankingsFiltersProps<TLocation>) {
   const { user } = useAuth();
   const t = useTranslations();
   const showLiveFilter = useLivePlayersAvailable() || live;
   const { navigate, preload, preloadClearAll, cancelPreload, loadStorage, saveStorage } = usePersistedParams({
      storageKey: rankingFilterPreferences.storageKey,
      search,
      buildLocation,
      parseSearch,
      persistedKeys: user ? rankingFilterPreferences.authPersistedKeys : rankingFilterPreferences.persistedKeys,
      legacyStorageKeys: rankingFilterPreferences.legacyStorageKeys
   });
   const currentSearch = search.search;
   const currentCountries = search.countries;
   const currentPivot = search.pivot;
   const userCountry = user ? parseCountryRegionParam(user.country) : undefined;
   const userCountryActive = Boolean(userCountry && formatCountryRegionParam(currentCountries) === formatCountryRegionParam(userCountry));
   const globalActive = !currentPivot && !userCountryActive;

   const [filtersOpen, setFiltersOpen] = useState(() => {
      const stored = loadStorage().filtersOpen;
      return stored == null ? initialFiltersOpen : stored === 'true';
   });
   const isPlayerPivot = currentPivot === 'player';
   const showPagination = totalPages > 1 && !isPlayerPivot;

   function preloadHandlers(updates: Partial<RankingsFiltersSearch>) {
      return {
         onMouseEnter: () => preload(updates),
         onFocus: () => preload(updates),
         onMouseLeave: cancelPreload,
         onBlur: cancelPreload
      };
   }

   function getGlobalUpdates() {
      return { pivot: undefined, highlight: undefined, countries: userCountryActive ? undefined : currentCountries };
   }

   function handleGlobalToggle() {
      if (globalActive) return;
      removeStorageValue(rankingFilterPreferences.pivotStorageKey);
      navigate(getGlobalUpdates());
   }

   function getPivotUpdates(pivot: PlayerControllerGetPlayersPivot) {
      if (currentPivot === pivot) return { pivot: undefined, highlight: undefined };

      return { pivot, highlight: pivot === 'player' && user ? user.id : undefined };
   }

   function handlePivotToggle(pivot: PlayerControllerGetPlayersPivot) {
      removeStorageValue(rankingFilterPreferences.pivotStorageKey);
      navigate(getPivotUpdates(pivot));
   }

   function getCountryUpdates() {
      return { countries: userCountryActive ? undefined : userCountry };
   }

   function handleCountryToggle() {
      if (!userCountry) return;
      navigate(getCountryUpdates());
   }

   const activeFilterCount =
      (currentPivot ? 1 : 0) +
      (currentCountries ? 1 : 0) +
      (includeInactive ? 1 : 0) +
      (live ? 1 : 0) +
      (currentSearch && currentSearch.length >= 3 ? 1 : 0);
   const hasActiveFilters = activeFilterCount > 0;
   const getPageLocation = (page: number) => buildLocation(updateSearchParams(search, { page: page > 1 ? page : undefined }));

   function handleClearAll() {
      removeStorageValue(rankingFilterPreferences.pivotStorageKey);
      navigate({
         search: undefined,
         countries: undefined,
         includeInactive: undefined,
         live: undefined,
         pivot: undefined,
         highlight: undefined
      });
   }

   return (
      <Collapsible
         open={isPlayerPivot || filtersOpen}
         onOpenChange={(open) => {
            setFiltersOpen(open);
            saveStorage({ filtersOpen: String(open) });
         }}
      >
         <div className="flex flex-col gap-3">
            {/* search */}
            {!isPlayerPivot && (
               <div className="flex items-center gap-2 md:gap-3">
                  {showPagination && (
                     <PaginationArrow direction="left" page={currentPage - 1} disabled={currentPage <= 1} getPageLocation={getPageLocation} />
                  )}

                  <div className="relative min-w-0 flex-1">
                     <DebouncedSearchInput
                        id="ranking-search"
                        initialValue={currentSearch ?? ''}
                        placeholder={t('common.searchPlaceholder')}
                        clearLabel={t('common.clearSearch')}
                        srLabel={t('rankings.searchPlayers')}
                        onSearchAction={(value) => navigate({ search: value })}
                     />

                     {/* toggle */}
                     <Tooltip>
                        <CollapsibleTrigger asChild>
                           <TooltipTrigger asChild>
                              <Button
                                 type="button"
                                 variant={hasActiveFilters ? 'default' : 'secondary'}
                                 size="icon-xs"
                                 aria-label={filtersOpen ? t('common.hideFilters') : t('common.showFilters')}
                                 className={cn(
                                    'absolute -bottom-2.5 left-1/2 z-10 h-5 -translate-x-1/2 rounded-full border',
                                    hasActiveFilters ? 'w-auto gap-1 px-2' : 'w-8',
                                    !hasActiveFilters && 'bg-secondary hover:bg-secondary/80'
                                 )}
                              >
                                 <FaChevronDown className={cn('size-2.5 transition-transform', filtersOpen && 'rotate-180')} aria-hidden="true" />
                                 {hasActiveFilters && <span className="text-[10px] leading-none">({activeFilterCount})</span>}
                              </Button>
                           </TooltipTrigger>
                        </CollapsibleTrigger>
                        <TooltipContent>{t('common.filters')}</TooltipContent>
                     </Tooltip>
                  </div>

                  {showPagination && (
                     <PaginationArrow
                        direction="right"
                        page={currentPage + 1}
                        disabled={currentPage >= totalPages}
                        getPageLocation={getPageLocation}
                     />
                  )}
               </div>
            )}

            <CollapsibleContent className="overflow-hidden pt-1">
               <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-1.5">
                  {/* pivot (authed only) */}
                  {user && (
                     <div className="flex items-center justify-center gap-1.5">
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <FilterPill
                                 className={QUICK_FILTER_BUTTON_CLASS}
                                 active={globalActive}
                                 icon={FaGlobe}
                                 aria-label={t('common.global')}
                                 {...preloadHandlers(getGlobalUpdates())}
                                 onClick={handleGlobalToggle}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{t('common.global')}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <FilterPill
                                 className={QUICK_FILTER_BUTTON_CLASS}
                                 active={isPlayerPivot}
                                 icon={FaUser}
                                 aria-label={t('common.aroundMe')}
                                 {...preloadHandlers(getPivotUpdates('player'))}
                                 onClick={() => handlePivotToggle('player')}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{t('common.aroundMe')}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <FilterPill
                                 className={QUICK_FILTER_BUTTON_CLASS}
                                 active={currentPivot === 'friends'}
                                 icon={FaUserFriends}
                                 aria-label={t('common.friends')}
                                 {...preloadHandlers(getPivotUpdates('friends'))}
                                 onClick={() => handlePivotToggle('friends')}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{t('common.friends')}</TooltipContent>
                        </Tooltip>
                        {userCountry && (
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <FilterPill
                                    className={QUICK_FILTER_BUTTON_CLASS}
                                    active={userCountryActive}
                                    aria-label={t('common.country')}
                                    {...preloadHandlers(getCountryUpdates())}
                                    onClick={handleCountryToggle}
                                 >
                                    <FadeInImage
                                       src={generateFlagUrl(user.country)}
                                       alt={user.country.toUpperCase()}
                                       width={14}
                                       height={14}
                                       className="pointer-events-none max-w-none"
                                    />
                                 </FilterPill>
                              </TooltipTrigger>
                              <TooltipContent>{t('common.country')}</TooltipContent>
                           </Tooltip>
                        )}
                     </div>
                  )}

                  {user && <Separator orientation="vertical" variant="gradient" size="toolbar" className="mx-1 hidden sm:block" />}

                  <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
                     {/* inactive */}
                     <FilterPill
                        className="cursor-pointer"
                        active={includeInactive}
                        {...preloadHandlers({ includeInactive: includeInactive ? undefined : 'true' })}
                        onClick={() => navigate({ includeInactive: includeInactive ? undefined : 'true' })}
                     >
                        {t('common.includeInactive')}
                     </FilterPill>

                     {/* live */}
                     {showLiveFilter && (
                        <FilterPill
                           className="cursor-pointer"
                           active={live}
                           icon={FaBroadcastTower}
                           {...preloadHandlers({ live: live ? undefined : 'true' })}
                           onClick={() => navigate({ live: live ? undefined : 'true' })}
                        >
                           {t('rankings.live')}
                        </FilterPill>
                     )}

                     {/* country */}
                     <CountryRegionFilter value={currentCountries} onChangeAction={(value) => navigate({ countries: value })} />

                     {/* clear */}
                     {hasActiveFilters && (
                        <FilterPill
                           className="cursor-pointer"
                           icon={FaTimes}
                           onMouseEnter={preloadClearAll}
                           onFocus={preloadClearAll}
                           onMouseLeave={cancelPreload}
                           onBlur={cancelPreload}
                           onClick={handleClearAll}
                        >
                           {t('common.clear')}
                        </FilterPill>
                     )}
                  </div>
               </div>
            </CollapsibleContent>
         </div>
      </Collapsible>
   );
}
