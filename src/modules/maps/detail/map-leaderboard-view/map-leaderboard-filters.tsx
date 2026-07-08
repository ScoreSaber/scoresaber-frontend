'use client';

import { FaFilter, FaGlobe, FaUser, FaUserFriends } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useAuth } from '@/modules/auth';
import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import type { LeaderboardControllerGetLeaderboardScoresByIdPivot } from '@/shared/api/generated/ApiParams';
import { generateFlagUrl } from '@/shared/components/country-image';
import { CountryRegionFilter } from '@/shared/components/country-region-filter';
import { DebouncedSearchInput } from '@/shared/components/debounced-search-input';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { FilterPill } from '@/shared/components/filter-pill';
import { formatCountryRegionParam, parseCountryRegionParam, type CountryRegionFilterValue } from '@/shared/country-region';
import { cn } from '@/shared/format/helpers';
import { leaderboardFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { usePersistedParams } from '@/shared/url-state/persisted/use-persisted-params';
import type { RouteLocationBuilder } from '@/shared/url-state/route-location';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';

const QUICK_FILTER_BUTTON_CLASS = 'h-8 w-8 cursor-pointer p-0 sm:p-0';

export function MapLeaderboardFilters<TLocation>({ currentSearch, search, buildLocation, parseSearch }: MapLeaderboardFiltersProps<TLocation>) {
   const tc = useTranslations();
   const { user } = useAuth();
   const { navigate, preload, cancelPreload, saveStorage } = usePersistedParams({
      storageKey: leaderboardFilterPreferences.storageKey,
      search,
      buildLocation,
      parseSearch,
      persistedKeys: user ? leaderboardFilterPreferences.persistedKeys : [],
      legacyStorageKeys: leaderboardFilterPreferences.legacyStorageKeys
   });
   const isLoggedIn = user != null;

   const currentPivot = search.pivot ?? null;
   const currentScope = search.scope === 'country' || search.scope === 'region' ? undefined : search.scope;
   const userCountry = user ? parseCountryRegionParam(user.country) : undefined;
   const userCountryActive =
      isLoggedIn &&
      (search.scope === 'country' || Boolean(userCountry && formatCountryRegionParam(currentScope) === formatCountryRegionParam(userCountry)));
   const viewerRegionActive = isLoggedIn && search.scope === 'region';
   const globalActive = !currentPivot && !userCountryActive && !viewerRegionActive;
   const activeScope = search.scope === 'country' || search.scope === 'region' ? isLoggedIn : Boolean(search.scope);
   const activeFilterCount = (activeScope ? 1 : 0) + (currentSearch ? 1 : 0) + (currentPivot ? 1 : 0);
   const hasActiveFilters = activeFilterCount > 0;

   function preloadHandlers(updates: Partial<LeaderboardSearchParams>) {
      return {
         onMouseEnter: () => preload(updates, { scroll: false }),
         onFocus: () => preload(updates, { scroll: false }),
         onMouseLeave: cancelPreload,
         onBlur: cancelPreload
      };
   }

   function getGlobalUpdates() {
      return { pivot: undefined, highlight: undefined, scope: userCountryActive || viewerRegionActive ? undefined : search.scope };
   }

   function navigateSearch(updates: Partial<LeaderboardSearchParams>) {
      navigate(updates, { scroll: false });
   }

   function handleGlobalToggle() {
      if (globalActive) return;
      saveStorage({ active_pivot: undefined, active_scope: undefined });
      navigateSearch(getGlobalUpdates());
   }

   function getPivotUpdates(pivot: LeaderboardControllerGetLeaderboardScoresByIdPivot) {
      if (currentPivot !== pivot) return { pivot, highlight: undefined };

      return { pivot: undefined, highlight: undefined };
   }

   function handlePivotToggle(pivot: LeaderboardControllerGetLeaderboardScoresByIdPivot) {
      if (currentPivot !== pivot) {
         saveStorage({ active_pivot: pivot });
         navigateSearch(getPivotUpdates(pivot));
         return;
      }
      saveStorage({ active_pivot: undefined });
      navigateSearch(getPivotUpdates(pivot));
   }

   function getCountryUpdates() {
      return { scope: userCountryActive ? undefined : userCountry };
   }

   function handleCountryToggle() {
      if (!userCountry) return;
      saveStorage({ active_scope: userCountryActive ? undefined : formatCountryRegionParam(userCountry) });
      navigateSearch(getCountryUpdates());
   }

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="filter"
               size="filter"
               className={cn(
                  'h-7 min-h-7 w-8 p-0 md:h-auto md:min-h-0 md:w-auto md:px-2.5 md:py-1.5',
                  hasActiveFilters && 'bg-primary text-primary-foreground hover:bg-primary/80'
               )}
               aria-label={tc('common.filters')}
            >
               <FaFilter className="size-2.5" />
               <span className="hidden md:inline">
                  {tc('common.filters')}
                  {hasActiveFilters && ` (${activeFilterCount})`}
               </span>
               {hasActiveFilters && <span className="text-[10px] leading-none md:hidden">{activeFilterCount}</span>}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-64 p-3" align="start" onOpenAutoFocus={(event) => event.preventDefault()}>
            <div className="flex flex-col gap-2">
               {isLoggedIn && (
                  <>
                     <div className="flex items-center justify-center gap-1.5">
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <FilterPill
                                 className={QUICK_FILTER_BUTTON_CLASS}
                                 active={globalActive}
                                 icon={FaGlobe}
                                 aria-label={tc('common.global')}
                                 {...preloadHandlers(getGlobalUpdates())}
                                 onClick={handleGlobalToggle}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{tc('common.global')}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <FilterPill
                                 className={QUICK_FILTER_BUTTON_CLASS}
                                 active={currentPivot === 'player'}
                                 icon={FaUser}
                                 aria-label={tc('common.aroundMe')}
                                 {...preloadHandlers(getPivotUpdates('player'))}
                                 onClick={() => handlePivotToggle('player')}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{tc('common.aroundMe')}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <FilterPill
                                 className={QUICK_FILTER_BUTTON_CLASS}
                                 active={currentPivot === 'friends'}
                                 icon={FaUserFriends}
                                 aria-label={tc('common.friends')}
                                 {...preloadHandlers(getPivotUpdates('friends'))}
                                 onClick={() => handlePivotToggle('friends')}
                              />
                           </TooltipTrigger>
                           <TooltipContent>{tc('common.friends')}</TooltipContent>
                        </Tooltip>
                        {userCountry && (
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <FilterPill
                                    className={QUICK_FILTER_BUTTON_CLASS}
                                    active={userCountryActive}
                                    aria-label={tc('common.country')}
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
                              <TooltipContent>{tc('common.country')}</TooltipContent>
                           </Tooltip>
                        )}
                     </div>
                     <Separator />
                  </>
               )}
               <LeaderboardScopeNavigator currentScope={currentScope} navigateAction={navigateSearch} className="*:flex-1" />
               <LeaderboardSearch currentSearch={currentSearch} navigateAction={navigateSearch} />
            </div>
         </PopoverContent>
      </Popover>
   );
}

function LeaderboardSearch({
   currentSearch,
   navigateAction
}: {
   currentSearch?: string;
   navigateAction: (updates: Partial<LeaderboardSearchParams>) => void;
}) {
   const t = useTranslations();
   const tc = useTranslations();

   return (
      <DebouncedSearchInput
         id="leaderboard-search"
         initialValue={currentSearch ?? ''}
         placeholder={t('map.searchPlayersPlaceholder')}
         clearLabel={tc('common.clearSearch')}
         srLabel={t('map.searchPlayersPlaceholder')}
         inputClassName="h-8 pr-7 pl-8 text-xs"
         onSearchAction={(value) => navigateAction({ search: value })}
      />
   );
}

function LeaderboardScopeNavigator({
   currentScope,
   navigateAction,
   className
}: {
   currentScope?: CountryRegionFilterValue;
   navigateAction: (updates: Partial<LeaderboardSearchParams>) => void;
   className?: string;
}) {
   return (
      <CountryRegionFilter
         value={currentScope}
         onChangeAction={(value) => navigateAction({ scope: value })}
         compact
         className={className}
         countryListMaxHeight="7.25rem"
      />
   );
}

interface MapLeaderboardFiltersProps<TLocation> {
   currentSearch?: string;
   search: LeaderboardSearchParams;
   buildLocation: RouteLocationBuilder<LeaderboardSearchParams, TLocation>;
   parseSearch: (search: SearchParamsRecord) => LeaderboardSearchParams | null;
}
