import { z } from 'zod';

import { countryCodeSchema, type CountryCode, type RegionCode, REGIONS } from '@/shared/country-region/countries';

type CountryRegionFilterValue = { kind: 'countries'; countries: CountryCode[] } | { kind: 'region'; region: RegionCode };

const regionCodeSet = new Set<string>(REGIONS.map((region) => region.code));
const regionByCode = new Map<RegionCode, (typeof REGIONS)[number]>(REGIONS.map((region) => [region.code, region]));
const regionByCountries = new Map<string, (typeof REGIONS)[number]>(REGIONS.map((region) => [region.countries, region]));
const regionCodeSchema = z.custom<RegionCode>((value) => typeof value === 'string' && regionCodeSet.has(value));

const countryRegionFilterSchema = z.union([
   z.object({
      kind: z.literal('countries'),
      countries: z.array(countryCodeSchema).min(1)
   }),
   z.object({
      kind: z.literal('region'),
      region: regionCodeSchema
   })
]);

const countryRegionSearchSchema = z.preprocess((value) => parseCountryRegionParam(value), countryRegionFilterSchema.optional());

function parseCountryRegionParam(value: unknown): CountryRegionFilterValue | undefined {
   if (value == null || value === '') return undefined;

   const parsed = countryRegionFilterSchema.safeParse(value);
   if (parsed.success) return parsed.data;

   if (typeof value !== 'string') return undefined;

   const raw = value
      .split(',')
      .map((part) => part.trim().toUpperCase())
      .filter(Boolean);
   if (raw.length === 0) return undefined;

   const csv = raw.join(',');
   const parsedRegionCode = regionCodeSchema.safeParse(raw[0]);
   const region = regionByCountries.get(csv) ?? (raw.length === 1 && parsedRegionCode.success ? regionByCode.get(parsedRegionCode.data) : undefined);
   if (region) return { kind: 'region', region: region.code };

   const countries = raw.flatMap((code) => {
      const result = countryCodeSchema.safeParse(code);
      return result.success ? [result.data] : [];
   });
   return countries.length > 0 ? { kind: 'countries', countries: [...new Set(countries)] } : undefined;
}

function formatCountryRegionParam(value: CountryRegionFilterValue | string | null | undefined) {
   if (!value) return undefined;
   if (typeof value === 'string') return value || undefined;

   if (value.kind === 'region') {
      return regionByCode.get(value.region)?.countries;
   }

   return value.countries.length > 0 ? value.countries.join(',') : undefined;
}

function getCountryRegionRegion(value?: CountryRegionFilterValue) {
   if (value?.kind !== 'region') return null;
   return regionByCode.get(value.region) ?? null;
}

function getCountryRegionCountries(value?: CountryRegionFilterValue) {
   return value?.kind === 'countries' ? value.countries : [];
}

export type { CountryRegionFilterValue };
export { countryRegionSearchSchema, formatCountryRegionParam, getCountryRegionCountries, getCountryRegionRegion, parseCountryRegionParam };
