'use client';

import { FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { FilterPill } from '@/shared/components/filter-pill';
import { PaginationArrow } from '@/shared/components/pagination';
import { rankRequestFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { usePersistedParams } from '@/shared/url-state/persisted/use-persisted-params';
import type { RouteLocationBuilder } from '@/shared/url-state/route-location';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';

type RankRequestsFilterSearch = SearchParamsRecord & {
   page?: number;
   search?: string;
   hideDownvoted?: true;
};

interface RankRequestFiltersProps<TLocation> {
   currentPage: number;
   totalPages: number;
   currentHideDownvoted?: boolean;
   search: RankRequestsFilterSearch;
   buildLocation: RouteLocationBuilder<RankRequestsFilterSearch, TLocation>;
   parseSearch: (search: SearchParamsRecord) => RankRequestsFilterSearch | null;
}

export function RankRequestFilters<TLocation>({
   currentPage,
   totalPages,
   currentHideDownvoted,
   search,
   buildLocation,
   parseSearch
}: RankRequestFiltersProps<TLocation>) {
   const t = useTranslations();
   const { navigate, preload, preloadClearAll, cancelPreload, clearAll } = usePersistedParams({
      storageKey: rankRequestFilterPreferences.storageKey,
      search,
      buildLocation,
      parseSearch,
      persistedKeys: rankRequestFilterPreferences.persistedKeys
   });

   const showPagination = totalPages > 1;
   const hasActiveFilters = Boolean(currentHideDownvoted);
   const getPageLocation = (page: number) => buildLocation(updateSearchParams(search, { page: page > 1 ? page : undefined }));
   const hideDownvotedUpdates: Partial<RankRequestsFilterSearch> = { hideDownvoted: currentHideDownvoted ? undefined : true };

   return (
      <div className="flex flex-col gap-3">
         <div className="flex items-center gap-2 md:gap-3">
            {showPagination && (
               <PaginationArrow direction="left" page={currentPage - 1} disabled={currentPage <= 1} getPageLocation={getPageLocation} />
            )}

            <div className="scrollbar-none flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-x-auto sm:flex-wrap">
               <FilterPill
                  className="cursor-pointer"
                  active={currentHideDownvoted}
                  icon={FaEyeSlash}
                  onMouseEnter={() => preload(hideDownvotedUpdates)}
                  onFocus={() => preload(hideDownvotedUpdates)}
                  onMouseLeave={cancelPreload}
                  onBlur={cancelPreload}
                  onClick={() => navigate({ hideDownvoted: currentHideDownvoted ? undefined : true })}
               >
                  {t('rankRequest.hideDownvoted')}
               </FilterPill>

               {hasActiveFilters && (
                  <FilterPill
                     className="cursor-pointer"
                     icon={FaTimes}
                     onMouseEnter={preloadClearAll}
                     onFocus={preloadClearAll}
                     onMouseLeave={cancelPreload}
                     onBlur={cancelPreload}
                     onClick={() => clearAll()}
                  >
                     {t('common.clear')}
                  </FilterPill>
               )}
            </div>

            {showPagination && (
               <PaginationArrow direction="right" page={currentPage + 1} disabled={currentPage >= totalPages} getPageLocation={getPageLocation} />
            )}
         </div>
      </div>
   );
}
