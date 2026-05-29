'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { cn } from '@/shared/format/helpers';
import { getDifficultyBgClass } from '@/shared/format/styling';

interface DifficultyPillProps {
   difficultyValue: number;
   difficultyName: string;
   starValue?: number;
   className?: string;
}

export function DifficultyPill({ difficultyValue, difficultyName, starValue, className }: DifficultyPillProps) {
   const displayValue = starValue ? `${starValue.toFixed(2)}★` : difficultyName;
   const badge = (
      <Badge variant="difficulty" className={cn(starValue && 'cursor-help', getDifficultyBgClass(difficultyValue), className)}>
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
