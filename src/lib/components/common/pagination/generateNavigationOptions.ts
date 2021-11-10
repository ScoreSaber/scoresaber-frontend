/**
 * Credits go to @TahaSh from the original svelte-paginate library.
 */

const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
const NEXT_PAGE = 'NEXT_PAGE';
const ELLIPSIS = 'ELLIPSIS';

export class PaginationInfo {
   totalItems: number;
   pageSize: number;
   currentPage: number;
   limit?: number = null;
   showStepOptions?: boolean = false;
}

export class PaginationOptions {
   type: 'number' | 'symbol';
   value?: number;
   symbol?: string;
}

export default function (info: PaginationInfo) {
   const totalPages = Math.ceil(info.totalItems / info.pageSize);
   const limitThreshold = getLimitThreshold(info.limit);
   const limited = info.limit && totalPages > limitThreshold;
   let options: PaginationOptions[] = limited ? generateLimitedOptions(totalPages, info) : generateUnlimitedOptions(totalPages);
   return info.showStepOptions ? addStepOptions(options, info.currentPage, totalPages) : options;
}

function generateUnlimitedOptions(totalPages: number): PaginationOptions[] {
   let options: PaginationOptions[] = [];
   for (let i = 1; i <= totalPages; i++) {
      options.push({ type: 'number', value: i });
   }
   return options;
}

function generateLimitedOptions(totalPages: number, { limit, currentPage }: PaginationInfo): PaginationOptions[] {
   const boundarySize = limit * 2 + 2;
   const firstBoundary = 1 + boundarySize;
   const lastBoundary = totalPages - boundarySize;
   const totalShownPages = firstBoundary + 2;

   let options: PaginationOptions[] = [];

   if (currentPage <= firstBoundary - limit) {
      for (let i = 0; i < totalShownPages; i++) {
         if (i === totalShownPages - 1) {
            options.push({
               type: 'number',
               value: totalPages
            });
            continue;
         } else if (i === totalShownPages - 2) {
            options.push({
               type: 'symbol',
               symbol: ELLIPSIS,
               value: firstBoundary + 1
            });
            continue;
         }
         options.push({
            type: 'number',
            value: i + 1
         });
      }
   } else if (currentPage >= lastBoundary + limit) {
      for (let i = 0; i < totalShownPages; i++) {
         if (i === 0) {
            options.push({
               type: 'number',
               value: 1
            });
            continue;
         } else if (i === 1) {
            options.push({
               type: 'symbol',
               symbol: ELLIPSIS,
               value: lastBoundary - 1
            });
            continue;
         }
         options.push({
            type: 'number',
            value: lastBoundary + i - 2
         });
      }
   } else if (currentPage >= firstBoundary - limit && currentPage <= lastBoundary + limit) {
      for (let i = 0; i < totalShownPages; i++) {
         if (i === 0) {
            options.push({
               type: 'number',
               value: 1
            });
            continue;
         } else if (i === 1) {
            options.push({
               type: 'symbol',
               symbol: ELLIPSIS,
               value: currentPage - limit + (i - 2)
            });
            continue;
         } else if (i === totalShownPages - 1) {
            options.push({
               type: 'number',
               value: totalPages
            });
            continue;
         } else if (i === totalShownPages - 2) {
            options.push({
               type: 'symbol',
               symbol: ELLIPSIS,
               value: currentPage + limit + 1
            });
            continue;
         }
         options.push({
            type: 'number',
            value: currentPage - limit + (i - 2)
         });
      }
   }

   return options;
}

function addStepOptions(options: PaginationOptions[], currentPage, totalPages: number): PaginationOptions[] {
   currentPage = parseInt(currentPage); // TS decided that even after putting a type annotation, currentPage would still be a string. :)
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

function getLimitThreshold(limit: number) {
   const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
   const numberOfBoundaryPages = 2; // The first and last pages are always shown
   return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
}
