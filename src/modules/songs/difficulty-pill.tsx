'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/shared/format/helpers';
import { getDifficultyBgClass } from '@/shared/format/styling';

interface DifficultyPillProps {
   difficultyValue: number;
   difficultyName: string;
   starValue?: number;
   size?: 'default' | 'compact';
   className?: string;
}

export function DifficultyPill({ difficultyValue, difficultyName, starValue, size = 'default', className }: DifficultyPillProps) {
   const displayValue = starValue ? `${starValue.toFixed(2)}★` : difficultyName;
   const badge = (
      <Badge
         variant="difficulty"
         className={cn(
            starValue && 'cursor-help',
            size === 'compact' && 'h-4 max-w-10 rounded-sm px-1 py-0 text-[9px] leading-none',
            getDifficultyBgClass(difficultyValue),
            className
         )}
      >
         {displayValue}
      </Badge>
   );

   // no tooltip when showing the fallback difficulty name -- it would just repeat what's already visible
   if (!starValue) {
      return badge;
   }

   return (
      <Tooltip>
         <TooltipTrigger asChild>{badge}</TooltipTrigger>
         <TooltipContent>
            <p>{difficultyName}</p>
         </TooltipContent>
      </Tooltip>
   );
}
