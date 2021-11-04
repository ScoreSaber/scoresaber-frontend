/**
 * Credits go to @TahaSh from the original svelte-paginate library.
 */

import { PREVIOUS_PAGE, NEXT_PAGE, ELLIPSIS } from './symbolTypes';

export default function ({ totalItems, pageSize, currentPage, limit = null, showStepOptions = false }) {
   const totalPages = Math.ceil(totalItems / pageSize);
   const limitThreshold = getLimitThreshold({ limit });
   const limited = limit && totalPages > limitThreshold;
   let options = limited ? generateLimitedOptions({ totalPages, limit, currentPage }) : generateUnlimitedOptions({ totalPages });
   return showStepOptions ? addStepOptions({ options, currentPage, totalPages }) : options;
}

function generateUnlimitedOptions({ totalPages }) {
   return new Array(totalPages).fill(null).map((value, index) => ({
      type: 'number',
      value: index + 1
   }));
}

function generateLimitedOptions({ totalPages, limit, currentPage }) {
   const boundarySize = limit * 2 + 2;
   const firstBoundary = 1 + boundarySize;
   const lastBoundary = totalPages - boundarySize;
   const totalShownPages = firstBoundary + 2;

   if (currentPage <= firstBoundary - limit) {
      return Array(totalShownPages)
         .fill(null)
         .map((value, index) => {
            if (index === totalShownPages - 1) {
               return {
                  type: 'number',
                  value: totalPages
               };
            } else if (index === totalShownPages - 2) {
               return {
                  type: 'symbol',
                  symbol: ELLIPSIS,
                  value: firstBoundary + 1
               };
            }
            return {
               type: 'number',
               value: index + 1
            };
         });
   } else if (currentPage >= lastBoundary + limit) {
      return Array(totalShownPages)
         .fill(null)
         .map((value, index) => {
            if (index === 0) {
               return {
                  type: 'number',
                  value: 1
               };
            } else if (index === 1) {
               return {
                  type: 'symbol',
                  symbol: ELLIPSIS,
                  value: lastBoundary - 1
               };
            }
            return {
               type: 'number',
               value: lastBoundary + index - 2
            };
         });
   } else if (currentPage >= firstBoundary - limit && currentPage <= lastBoundary + limit) {
      return Array(totalShownPages)
         .fill(null)
         .map((value, index) => {
            if (index === 0) {
               return {
                  type: 'number',
                  value: 1
               };
            } else if (index === 1) {
               return {
                  type: 'symbol',
                  symbol: ELLIPSIS,
                  value: currentPage - limit + (index - 2)
               };
            } else if (index === totalShownPages - 1) {
               return {
                  type: 'number',
                  value: totalPages
               };
            } else if (index === totalShownPages - 2) {
               return {
                  type: 'symbol',
                  symbol: ELLIPSIS,
                  value: currentPage + limit + 1
               };
            }
            return {
               type: 'number',
               value: currentPage - limit + (index - 2)
            };
         });
   }
}

function addStepOptions({ options, currentPage, totalPages }) {
   return [
      {
         type: 'symbol',
         symbol: PREVIOUS_PAGE,
         value: currentPage <= 1 ? 1 : currentPage - 1
      },
      ...options,
      {
         type: 'symbol',
         symbol: NEXT_PAGE,
         value: currentPage >= totalPages ? totalPages : currentPage + 1
      }
   ];
}

function getLimitThreshold({ limit }) {
   const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
   const numberOfBoundaryPages = 2; // The first and last pages are always shown
   return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
}
