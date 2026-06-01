'use client';

import { useEffect, useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'use-intl';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/shared/format/helpers';

type TimeProps = {
   date: Date | string | number | null | undefined;
   short?: boolean;
   dateOnly?: boolean;
   className?: string;
   longRelativeClassName?: string;
};

const RELATIVE_UNITS: { seconds: number; unit: Intl.RelativeTimeFormatUnit }[] = [
   { seconds: 31536000, unit: 'year' },
   { seconds: 2628000, unit: 'month' },
   { seconds: 86400, unit: 'day' },
   { seconds: 3600, unit: 'hour' },
   { seconds: 60, unit: 'minute' }
];

const LONG_SHORT_TIME_LENGTH = 12;

export function Time({ date, short, dateOnly, className, longRelativeClassName }: TimeProps) {
   const dateObj = date == null ? null : new Date(date);
   const [mounted, setMounted] = useState(false);
   const locale = useLocale();
   const t = useTranslations('common');
   const formatters = useMemo(() => createTimeFormatters(locale), [locale]);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!dateObj || isNaN(dateObj.getTime())) {
      return <span className={className}>{t('unknownDate')}</span>;
   }

   const fullDate = formatters.fullDate.format(dateObj);

   if (dateOnly) {
      return (
         <Tooltip>
            <TooltipTrigger asChild>
               <span className={cn(className, 'cursor-help')}>{formatters.monthYear.format(dateObj)}</span>
            </TooltipTrigger>
            <TooltipContent>
               <p>{fullDate}</p>
            </TooltipContent>
         </Tooltip>
      );
   }

   const displayText = mounted ? timeAgo(dateObj, short, formatters, t('justNow')) : formatters.shortDate.format(dateObj);

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <span
               className={cn(
                  className,
                  'cursor-help',
                  short && 'whitespace-nowrap',
                  short && displayText.length > LONG_SHORT_TIME_LENGTH && longRelativeClassName
               )}
               suppressHydrationWarning
            >
               {displayText}
            </span>
         </TooltipTrigger>
         <TooltipContent>
            <p>{fullDate}</p>
         </TooltipContent>
      </Tooltip>
   );
}

function timeAgo(date: Date, isShort: boolean | undefined, formatters: TimeFormatters, justNow: string) {
   const secondsFromNow = Math.round((date.getTime() - Date.now()) / 1000);
   const absoluteSeconds = Math.abs(secondsFromNow);

   for (const { seconds, unit } of RELATIVE_UNITS) {
      if (absoluteSeconds < seconds) continue;
      const value = Math.trunc(secondsFromNow / seconds);
      const rtf = isShort ? formatters.relativeShort : formatters.relativeLong;
      return rtf.format(value, unit);
   }
   return justNow;
}

type TimeFormatters = ReturnType<typeof createTimeFormatters>;

function createTimeFormatters(locale: string) {
   return {
      relativeLong: new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'long' }),
      relativeShort: new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'narrow' }),
      fullDate: new Intl.DateTimeFormat(locale, {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: 'numeric',
         minute: '2-digit',
         second: '2-digit'
      }),
      monthYear: new Intl.DateTimeFormat(locale, {
         month: 'long',
         year: 'numeric'
      }),
      shortDate: new Intl.DateTimeFormat(locale, {
         month: 'short',
         day: 'numeric',
         year: '2-digit'
      })
   };
}
