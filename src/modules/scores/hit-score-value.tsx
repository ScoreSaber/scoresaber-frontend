'use client';

import { cn } from '@/shared/format/helpers';

const MAX_HIT_SCORE = 115;

interface HitScoreValueProps {
   value: number;
   decimals?: number;
   className?: string;
}

function formatHitScorePercent(value: number) {
   return `${((value / MAX_HIT_SCORE) * 100).toFixed(2)}%`;
}

export function HitScoreValue({ value, decimals = 2, className }: HitScoreValueProps) {
   const points = Number.isFinite(value) ? value.toFixed(decimals) : '--';
   const percent = Number.isFinite(value) ? formatHitScorePercent(value) : '--';

   return (
      <span
         tabIndex={0}
         aria-label={`${points} (${percent})`}
         className={cn(
            'group inline-grid cursor-help place-items-center tabular-nums outline-none focus-visible:ring-1 focus-visible:ring-current/40',
            className
         )}
      >
         <span
            aria-hidden="true"
            className="col-start-1 row-start-1 transition-opacity duration-150 group-hover:opacity-0 group-focus-visible:opacity-0"
         >
            {points}
         </span>
         <span
            aria-hidden="true"
            className="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
         >
            {percent}
         </span>
      </span>
   );
}
