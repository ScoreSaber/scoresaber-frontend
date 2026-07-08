import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { cn, formatNumber } from '@/shared/format/helpers';

export function WeeklyRankChange({ change, className }: { change: number | null; className?: string }) {
   const t = useTranslations();

   if (change === null || change === 0) return null;

   const climbed = change > 0;
   const Icon = climbed ? FaCaretUp : FaCaretDown;

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <span
               className={cn(
                  'inline-flex items-center gap-0.5 align-middle text-xs leading-none font-semibold tabular-nums',
                  climbed ? 'text-status-success' : 'text-status-error',
                  className
               )}
            >
               <Icon className="size-2.5 shrink-0" aria-hidden />
               {formatNumber(Math.abs(change))}
            </span>
         </TooltipTrigger>
         <TooltipContent>{t('player.weeklyRankChangeTooltip')}</TooltipContent>
      </Tooltip>
   );
}
