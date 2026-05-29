'use client';

import { useRef, useState } from 'react';

import { FaCheck, FaChevronDown, FaFlag, FaGlobe, FaTimes } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { generateFlagUrl } from '@/shared/components/country-image';
import { FadeInImage } from '@/shared/components/fade-in-image';
import type { CountryRegionFilterValue } from '@/shared/country-region';
import { getCountryRegionCountries, getCountryRegionRegion } from '@/shared/country-region';
import type { CountryCode, RegionCode } from '@/shared/country-region/countries';
import { getCountryData, getCountryName, REGIONS } from '@/shared/country-region/countries';
import { cn } from '@/shared/format/helpers';

const COUNTRIES = getCountryData();

interface CountryRegionFilterProps {
   value?: CountryRegionFilterValue;
   onChangeAction: (value: CountryRegionFilterValue | undefined) => void;
   disabled?: boolean;
   compact?: boolean;
   className?: string;
   countryListMaxHeight?: string;
}

export function CountryRegionFilter({ value, onChangeAction, disabled, compact, className, countryListMaxHeight }: CountryRegionFilterProps) {
   const t = useTranslations();
   const [countryOpen, setCountryOpen] = useState(false);
   const [regionOpen, setRegionOpen] = useState(false);

   // draft state for country -- only committed on confirm
   const [draftCountries, setDraftCountries] = useState<Set<CountryCode>>(new Set());
   const confirmedCountryRef = useRef(false);

   // draft state for region -- only committed on confirm
   const [draftRegion, setDraftRegion] = useState<RegionCode | undefined>(undefined);
   const confirmedRegionRef = useRef(false);

   const activeRegion = getCountryRegionRegion(value);
   const selectedCodes = getCountryRegionCountries(value);

   // use draft when country popover is open, otherwise use committed value
   const displayCodes = countryOpen ? [...draftCountries] : selectedCodes;
   const displaySet = countryOpen ? draftCountries : new Set(selectedCodes);

   // use draft when region popover is open, otherwise use committed value
   const displayRegion = regionOpen ? (REGIONS.find((region) => region.code === draftRegion) ?? null) : activeRegion;

   function handleCountryOpenChange(open: boolean) {
      if (open) {
         // snapshot current value into draft
         setDraftCountries(new Set(selectedCodes));
         confirmedCountryRef.current = false;
      } else if (!confirmedCountryRef.current) {
         // closed without confirming -- discard draft (no-op on committed value)
         setDraftCountries(new Set());
      }
      setCountryOpen(open);
   }

   function handleCountryToggle(code: CountryCode) {
      setDraftCountries((prev) => {
         const next = new Set(prev);
         if (next.has(code)) next.delete(code);
         else next.add(code);
         return next;
      });
   }

   function handleCountryConfirm() {
      confirmedCountryRef.current = true;
      onChangeAction(draftCountries.size > 0 ? { kind: 'countries', countries: [...draftCountries] } : undefined);
      setCountryOpen(false);
   }

   function handleRegionOpenChange(open: boolean) {
      if (open) {
         setDraftRegion(activeRegion?.code);
         confirmedRegionRef.current = false;
      } else if (!confirmedRegionRef.current) {
         setDraftRegion(undefined);
      }
      setRegionOpen(open);
   }

   function handleRegionSelect(region: (typeof REGIONS)[number]) {
      setDraftRegion((prev) => (prev === region.code ? undefined : region.code));
   }

   function handleRegionConfirm() {
      confirmedRegionRef.current = true;
      onChangeAction(draftRegion ? { kind: 'region', region: draftRegion } : undefined);
      setRegionOpen(false);
   }

   const regionLabel = activeRegion ? (
      activeRegion.label
   ) : compact ? (
      t('common.region')
   ) : (
      <>
         <span className="md:hidden">{t('common.region')}</span>
         <span className="hidden md:inline">{t('common.filterByRegion')}</span>
      </>
   );

   const hasDraftCountryChanges = draftCountries.size !== selectedCodes.length || selectedCodes.some((c) => !draftCountries.has(c));
   const hasDraftRegionChanges = draftRegion !== activeRegion?.code;

   return (
      <div className={cn('flex items-center gap-1.5', className)}>
         {/* country */}
         <Popover open={countryOpen} onOpenChange={handleCountryOpenChange}>
            <PopoverTrigger asChild>
               <Button variant={selectedCodes.length > 0 ? 'default' : 'filter'} size="filter" disabled={disabled}>
                  <FaFlag className="size-2.5 shrink-0 opacity-70" />
                  {compact ? (
                     t('common.country')
                  ) : (
                     <>
                        <span className="md:hidden">{t('common.country')}</span>
                        <span className="hidden md:inline">{t('common.filterByCountry')}</span>
                     </>
                  )}
                  <FaChevronDown className="size-2.5 shrink-0 opacity-70" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-64 flex-col p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
               <Command>
                  <CommandInput placeholder={t('common.searchCountries')} />
                  {displayCodes.length > 0 && (
                     <>
                        <Separator />
                        <div className="flex flex-wrap gap-1.5 p-2">
                           {displayCodes.map((code) => (
                              <Button
                                 key={code}
                                 type="button"
                                 onClick={() => handleCountryToggle(code)}
                                 disabled={disabled}
                                 variant="outline"
                                 size="xs"
                                 className="bg-secondary/60 hover:border-destructive/40 hover:bg-destructive/20 cursor-pointer rounded-full py-0.5 pr-1.5 pl-1 text-xs"
                              >
                                 <FadeInImage src={generateFlagUrl(code)} alt={code} width={14} height={14} className="max-w-none" />
                                 <span>{getCountryName(code)}</span>
                                 <FaTimes className="text-muted-foreground size-2" />
                              </Button>
                           ))}
                        </div>
                        <Separator />
                     </>
                  )}
                  <CommandList style={countryListMaxHeight ? { maxHeight: countryListMaxHeight } : undefined}>
                     <CommandEmpty>{t('common.noCountryFound')}</CommandEmpty>
                     <CommandGroup>
                        {COUNTRIES.map(({ code, name }) => (
                           <CommandItem key={code} value={name} onSelect={() => handleCountryToggle(code)} className="cursor-pointer gap-2">
                              <FadeInImage src={generateFlagUrl(code)} alt={code} width={18} height={18} className="max-w-none" />
                              <span className={cn(displaySet.has(code) && 'font-medium')}>{name}</span>
                              {displaySet.has(code) && <span className="text-primary ml-auto text-xs">&#10003;</span>}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
               {/* sticky confirm */}
               <div className="border-t p-2">
                  <Button
                     type="button"
                     size="xs"
                     className="w-full cursor-pointer"
                     disabled={disabled || !hasDraftCountryChanges}
                     onClick={handleCountryConfirm}
                  >
                     {t('common.applyFilter')}
                  </Button>
               </div>
            </PopoverContent>
         </Popover>

         {/* region */}
         <Popover open={regionOpen} onOpenChange={handleRegionOpenChange}>
            <PopoverTrigger asChild>
               <Button variant={activeRegion ? 'default' : 'filter'} size="filter" disabled={disabled}>
                  <FaGlobe className="size-2.5 shrink-0 opacity-70" />
                  {regionLabel}
                  <FaChevronDown className="size-2.5 shrink-0 opacity-70" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1" align="start">
               <div className="text-muted-foreground px-2 py-1.5 text-xs">{t('common.region')}</div>
               {REGIONS.map((region) => {
                  const isActive = displayRegion?.code === region.code;
                  return (
                     <button
                        key={region.code}
                        type="button"
                        onClick={() => handleRegionSelect(region)}
                        className={cn(
                           'hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
                           isActive && 'font-medium'
                        )}
                     >
                        {region.label}
                        {isActive && <FaCheck className="text-primary ml-auto size-3" />}
                     </button>
                  );
               })}
               {/* sticky confirm */}
               <div className="border-t p-1 pt-2">
                  <Button
                     type="button"
                     size="xs"
                     className="w-full cursor-pointer"
                     disabled={disabled || !hasDraftRegionChanges}
                     onClick={handleRegionConfirm}
                  >
                     {t('common.applyFilter')}
                  </Button>
               </div>
            </PopoverContent>
         </Popover>
      </div>
   );
}
