'use client';

import { useState } from 'react';

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
   const [showTouchPercent, setShowTouchPercent] = useState(false);
   const points = Number.isFinite(value) ? value.toFixed(decimals) : '--';
   const percent = Number.isFinite(value) ? formatHitScorePercent(value) : '--';

   return (
      <span
         tabIndex={0}
         aria-label={`${points} (${percent})`}
         data-show-percent={showTouchPercent}
         onTouchEnd={() => setShowTouchPercent((current) => !current)}
         className={cn(
            'group inline-grid cursor-help touch-manipulation place-items-center tabular-nums outline-none focus-visible:ring-1 focus-visible:ring-current/40',
            className
         )}
      >
         <span
            aria-hidden="true"
            className="col-start-1 row-start-1 transition-opacity duration-150 group-focus-visible:opacity-0 group-data-[show-percent=true]:opacity-0 [@media(hover:hover)]:group-hover:opacity-0"
         >
            {points}
         </span>
         <span
            aria-hidden="true"
            className="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 group-focus-visible:opacity-100 group-data-[show-percent=true]:opacity-100 [@media(hover:hover)]:group-hover:opacity-100"
         >
            {percent}
         </span>
      </span>
   );
}
