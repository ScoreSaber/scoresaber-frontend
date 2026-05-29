import type { CountryRegionFilterValue } from '@/shared/country-region';

export type SearchParamValue = string | number | boolean | CountryRegionFilterValue | null | undefined;
export type SearchParamsRecord = Record<string, SearchParamValue>;
