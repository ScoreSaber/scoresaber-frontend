'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { FadeInImage } from '@/shared/components/fade-in-image';
import { getCountryName } from '@/shared/country-region/countries';
import { cn } from '@/shared/format/helpers';

interface CountryImageProps {
   country: string;
   className?: string;
   size?: number;
}

export function CountryImage({ country, className, size = 24 }: CountryImageProps) {
   const countryImage = generateFlagUrl(country);
   const countryEmoji = generateFlagEmoji(country);
   const countryName = getCountryName(country);

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <div className={cn('flex cursor-help items-center', className)}>
               <FadeInImage className="max-w-none" alt={countryEmoji} src={countryImage} width={size} height={size} />
            </div>
         </TooltipTrigger>
         <TooltipContent>
            <p>{countryName}</p>
         </TooltipContent>
      </Tooltip>
   );
}

// local twemoji flag path
function generateFlagUrl(countryCode: string) {
   const matches = countryCode.toLowerCase().match(/[a-z]/g);
   if (!matches) return '/twemoji/unknown.png';

   return `/twemoji/${matches
      .map((char) => {
         const codePoint = char.codePointAt(0);
         return codePoint ? (codePoint + 127365).toString(16) : '';
      })
      .join('-')}.png`;
}

// flag emoji for alt text
function generateFlagEmoji(countryCode: string) {
   return countryCode.toLowerCase().replace(/[a-z]/g, (char) => {
      const codePoint = char.codePointAt(0);
      return codePoint ? String.fromCodePoint(codePoint - 97 + 0x1f1e6) : '';
   });
}

export { generateFlagUrl };
