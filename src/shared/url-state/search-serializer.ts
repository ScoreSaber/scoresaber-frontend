import { formatCountryRegionParam, parseCountryRegionParam } from '@/shared/country-region';

type SearchValue = string | number | boolean | null | undefined | readonly SearchValue[] | Record<string, unknown>;

export function parseUrlSearch(searchStr: string): Record<string, string> {
   const rawSearch = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
   const searchParams = new URLSearchParams(rawSearch.replaceAll('?', '&'));
   const search: Record<string, string> = {};

   for (const [key, value] of searchParams.entries()) {
      search[key] = value;
   }

   return search;
}

export function stringifyUrlSearch(search: Record<string, SearchValue>) {
   const searchParams = new URLSearchParams();

   for (const [key, value] of Object.entries(search)) {
      appendSearchValue(searchParams, key, value);
   }

   const next = searchParams.toString();
   return next ? `?${next}` : '';
}

export function normalizeSearchRecord(search: Record<string, unknown>) {
   const params: Record<string, string | string[] | undefined> = {};

   for (const [key, value] of Object.entries(search)) {
      if (Array.isArray(value)) {
         params[key] = value.length > 0 ? String(value[value.length - 1]) : undefined;
      } else if (value != null) {
         params[key] = typeof value === 'object' ? formatObjectSearchValue(value) : String(value);
      }
   }

   return params;
}

function appendSearchValue(searchParams: URLSearchParams, key: string, value: SearchValue) {
   if (value == null || value === '') return;
   if (key === 'page' && value === 1) return;

   if (Array.isArray(value)) {
      for (const item of value) {
         appendSearchValue(searchParams, key, item);
      }
      return;
   }

   searchParams.append(key, typeof value === 'object' ? formatObjectSearchValue(value) : String(value));
}

function formatObjectSearchValue(value: object) {
   const countryRegion = parseCountryRegionParam(value);
   return formatCountryRegionParam(countryRegion) ?? JSON.stringify(value);
}
