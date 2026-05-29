'use client';

import { useEffect, useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/shared/format/helpers';

type TimeProps = {
   date: Date | string | number | null | undefined;
   short?: boolean;
   dateOnly?: boolean;
   className?: string;
};

const RELATIVE_UNITS: { seconds: number; unit: Intl.RelativeTimeFormatUnit }[] = [
   { seconds: 31536000, unit: 'year' },
   { seconds: 2628000, unit: 'month' },
   { seconds: 86400, unit: 'day' },
   { seconds: 3600, unit: 'hour' },
   { seconds: 60, unit: 'minute' }
];

const rtfLong = new Intl.RelativeTimeFormat('en', { numeric: 'always', style: 'long' });
const rtfShort = new Intl.RelativeTimeFormat('en', { numeric: 'always', style: 'narrow' });

export function Time({ date, short, dateOnly, className }: TimeProps) {
   const dateObj = date == null ? null : new Date(date);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!dateObj || isNaN(dateObj.getTime())) {
      return <span className={className}>Unknown date</span>;
   }

   const fullDate = fullDateFormatter.format(dateObj);

   if (dateOnly) {
      return (
         <Tooltip>
            <TooltipTrigger asChild>
               <span className={cn(className, 'cursor-help')}>{monthYearFormatter.format(dateObj)}</span>
            </TooltipTrigger>
            <TooltipContent>
               <p>{fullDate}</p>
            </TooltipContent>
         </Tooltip>
      );
   }

   const displayText = mounted ? timeAgo(dateObj, short) : shortDateFormatter.format(dateObj);

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <span className={cn(className, 'cursor-help')} suppressHydrationWarning>
               {displayText}
            </span>
         </TooltipTrigger>
         <TooltipContent>
            <p>{fullDate}</p>
         </TooltipContent>
      </Tooltip>
   );
}

function timeAgo(date: Date, isShort?: boolean) {
   const secs = Math.floor((Date.now() - date.getTime()) / 1000);
   const rtf = isShort ? rtfShort : rtfLong;

   for (const { seconds, unit } of RELATIVE_UNITS) {
      const count = Math.floor(secs / seconds);
      if (count >= 1) return rtf.format(-count, unit);
   }
   return 'just now';
}

const fullDateFormatter = new Intl.DateTimeFormat('en', {
   weekday: 'long',
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   hour: 'numeric',
   minute: '2-digit',
   second: '2-digit'
});

const monthYearFormatter = new Intl.DateTimeFormat('en', {
   month: 'long',
   year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en', {
   month: 'short',
   day: 'numeric',
   year: '2-digit'
});
