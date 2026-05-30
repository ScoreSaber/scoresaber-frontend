'use client';

import { Timer } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { HitScoreValue } from './hit-score-value';

import { Stat } from '@/shared/components/stat';
import { cn } from '@/shared/format/helpers';

interface HandAccuracyRingProps {
   side: 'left' | 'right';
   accuracy: number;
   averageCut: number[];
   timeDependence: number;
}

export function HandAccuracyRing({ side, accuracy, averageCut, timeDependence }: HandAccuracyRingProps) {
   const t = useTranslations();
   const maxAccuracy = 115;
   const rawGap = 1 - Math.min(accuracy / maxAccuracy, 1);
   const percentage = 1 - Math.pow(rawGap, 0.8);
   const radius = 36;
   const circumference = 2 * Math.PI * radius;
   const strokeDashoffset = circumference * (1 - percentage);

   const isLeft = side === 'left';
   const ringColor = isLeft ? 'stroke-red-500' : 'stroke-blue-500';
   const bgColor = isLeft ? 'bg-red-500/10' : 'bg-blue-500/10';
   const borderColor = isLeft ? 'border-red-500/30' : 'border-blue-500/30';

   return (
      <div className={cn('flex items-center gap-2 sm:gap-3', isLeft ? 'flex-row-reverse' : 'flex-row')}>
         {/* cuts */}
         <div className="text-muted-foreground flex flex-col items-center text-xs tabular-nums">
            <span>{Number(averageCut[0] ?? 0).toFixed(2)}</span>
            <span>{Number(averageCut[1] ?? 0).toFixed(2)}</span>
            <span>{Number(averageCut[2] ?? 0).toFixed(2)}</span>
         </div>

         {/* ring + td */}
         <div className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center">
               <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
                  <circle cx="44" cy="44" r={radius} fill="none" strokeWidth="5" className="stroke-muted/30" />
                  <circle
                     cx="44"
                     cy="44"
                     r={radius}
                     fill="none"
                     strokeWidth="5"
                     strokeLinecap="butt"
                     strokeDasharray={circumference}
                     strokeDashoffset={strokeDashoffset}
                     className={cn(ringColor, 'transition-[stroke-dashoffset] duration-700 ease-out')}
                  />
               </svg>
               <HitScoreValue value={accuracy} className="absolute min-h-10 min-w-16 rounded-sm text-sm font-semibold" />
            </div>
            <Stat icon={Timer} label={t('score.timeDependenceShort')} className={cn('gap-1.5 px-2 py-0.5 text-[11px]', bgColor, borderColor)}>
               {timeDependence.toFixed(3)}
            </Stat>
         </div>
      </div>
   );
}
