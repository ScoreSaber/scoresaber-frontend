'use client';

import { useState } from 'react';

import { Grid3X3, Info } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { ScoreControllerGetScoreStatsResponse } from '@/shared/api/generated/ApiParams';
import { cn } from '@/shared/format/helpers';

const GRID_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const CUT_DIRECTIONS = [
   { key: 'up-left', rotation: 135, dot: false },
   { key: 'up', rotation: 180, dot: false },
   { key: 'up-right', rotation: 225, dot: false },
   { key: 'left', rotation: 90, dot: false },
   { key: 'any', rotation: 0, dot: true },
   { key: 'right', rotation: 270, dot: false },
   { key: 'down-left', rotation: 45, dot: false },
   { key: 'down', rotation: 0, dot: false },
   { key: 'down-right', rotation: 315, dot: false }
];

type Grid = ScoreControllerGetScoreStatsResponse['gridCutDetails']['grid'];
type DirectionalCut = Grid[number]['left'][number];
type Hand = 'left' | 'right';

function hasCuts(cuts: DirectionalCut[]) {
   return cuts.some((cut) => cut.count > 0);
}

function scoreColour(score: number, min: number, range: number) {
   const weight = (score - min) / range;
   return {
      red: Math.round(180 - weight * 130),
      green: Math.round(80 + weight * 120),
      blue: Math.round(80 - weight * 30)
   };
}

export function ScoreSliceGrid({ grid }: { grid: Grid }) {
   const t = useTranslations();
   const [selectedGridIndex, setSelectedGridIndex] = useState<number | null>(null);
   const [hand, setHand] = useState<Hand>('left');
   const cells = grid.slice(0, GRID_POSITIONS.length);

   if (cells.length < GRID_POSITIONS.length || !cells.some((cell) => cell.count > 0)) return null;

   const scores = cells.filter((cell) => cell.count > 0).map((cell) => cell.avgScore);
   const min = Math.min(...scores);
   const max = Math.max(...scores);
   const range = max - min || 1;
   const selectedCell = selectedGridIndex == null ? undefined : cells[selectedGridIndex];

   const selectGridPosition = (index: number) => {
      const cell = cells[index];
      if (!cell || cell.count === 0) return;

      setSelectedGridIndex(index);
      const otherHand = hand === 'left' ? 'right' : 'left';
      if (!hasCuts(cell[hand]) && hasCuts(cell[otherHand])) {
         setHand(otherHand);
      }
   };

   return (
      <div className="flex flex-col items-center gap-2">
         <div className="flex flex-col items-center gap-0.5">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
               <Grid3X3 className="size-3" />
               <span>{t('score.gridAccuracy')}</span>
            </div>
            <div className="text-muted-foreground/70 flex items-center gap-1 text-[10px]">
               <Info className="size-2.5" />
               <span className="hidden sm:inline">{t('score.gridHintClick')}</span>
               <span className="sm:hidden">{t('score.gridHintTap')}</span>
            </div>
         </div>

         <div className="grid grid-cols-4 gap-1 rounded-md sm:gap-0.5">
            {GRID_POSITIONS.map((gridIndex) => {
               const cell = cells[gridIndex];
               if (cell.count === 0) {
                  return (
                     <div key={gridIndex} className="flex h-8 w-11 items-center justify-center rounded-sm text-[10px] opacity-30 sm:h-7 sm:w-9">
                        --
                     </div>
                  );
               }

               const colour = scoreColour(cell.avgScore, min, range);
               return (
                  <button
                     key={gridIndex}
                     type="button"
                     aria-pressed={selectedGridIndex === gridIndex}
                     aria-label={t('score.sliceAverage', { score: cell.avgScore.toFixed(2), count: cell.count })}
                     className={cn(
                        'focus-visible:ring-ring flex h-8 w-11 cursor-pointer items-center justify-center rounded-sm text-[10px] font-semibold tabular-nums transition-shadow outline-none focus-visible:ring-2 sm:h-7 sm:w-9',
                        selectedGridIndex === gridIndex && 'ring-foreground/70 ring-1 ring-offset-1 ring-offset-transparent'
                     )}
                     style={{
                        backgroundColor: `rgba(${colour.red}, ${colour.green}, ${colour.blue}, 0.15)`,
                        color: `rgb(${colour.red}, ${colour.green}, ${colour.blue})`
                     }}
                     onClick={() => selectGridPosition(gridIndex)}
                  >
                     {cell.avgScore.toFixed(1)}
                  </button>
               );
            })}
         </div>

         {selectedCell && (
            <div className="border-border/60 mt-1 flex flex-col items-center gap-2 border-t pt-2">
               <ToggleGroup
                  type="single"
                  value={hand}
                  variant="outline"
                  size="sm"
                  aria-label={t('score.hand')}
                  className="sm:hidden"
                  onValueChange={(value) => {
                     if (value === 'left' || value === 'right') setHand(value);
                  }}
               >
                  <ToggleGroupItem value="left" aria-label={t('score.leftHand')} className="h-6 min-w-10 px-2 text-[10px]">
                     {t('score.leftShort')}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label={t('score.rightHand')} className="h-6 min-w-10 px-2 text-[10px]">
                     {t('score.rightShort')}
                  </ToggleGroupItem>
               </ToggleGroup>

               <div className="sm:hidden">
                  <SliceDirectionGrid cuts={selectedCell[hand]} hand={hand} />
               </div>

               <div className="hidden gap-3 sm:flex">
                  <div className="flex flex-col items-center gap-1.5">
                     <span className="text-muted-foreground text-[10px] font-medium">{t('score.leftHand')}</span>
                     <SliceDirectionGrid cuts={selectedCell.left} hand="left" />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                     <span className="text-muted-foreground text-[10px] font-medium">{t('score.rightHand')}</span>
                     <SliceDirectionGrid cuts={selectedCell.right} hand="right" />
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

function SliceDirectionGrid({ cuts, hand }: { cuts: DirectionalCut[]; hand: Hand }) {
   return (
      <div className="grid w-44 grid-cols-3 gap-1">
         {CUT_DIRECTIONS.map((direction, index) => (
            <SliceNote key={direction.key} cut={cuts[index]} hand={hand} rotation={direction.rotation} dot={direction.dot} />
         ))}
      </div>
   );
}

function SliceNote({ cut, hand, rotation, dot }: { cut: DirectionalCut | undefined; hand: Hand; rotation: number; dot: boolean }) {
   const t = useTranslations();
   const hasCut = cut != null && cut.count > 0;
   const content = <SliceNoteGraphic cut={cut} hand={hand} rotation={rotation} dot={dot} />;

   if (!hasCut) return content;

   const [before, after, accuracy] = cut.avgCutScore;
   const average = t('score.sliceAverage', { score: cut.avgScore.toFixed(2), count: cut.count });
   const components = t('score.sliceComponents', {
      before: before.toFixed(2),
      after: after.toFixed(2),
      accuracy: accuracy.toFixed(2)
   });

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <div tabIndex={0} aria-label={`${average}. ${components}`} className="cursor-help rounded-md outline-none focus-visible:ring-2">
               {content}
            </div>
         </TooltipTrigger>
         <TooltipContent className="flex flex-col gap-0.5 text-left text-nowrap">
            <span className="font-medium">{average}</span>
            <span className="opacity-75">{components}</span>
         </TooltipContent>
      </Tooltip>
   );
}

function SliceNoteGraphic({ cut, hand, rotation, dot }: { cut: DirectionalCut | undefined; hand: Hand; rotation: number; dot: boolean }) {
   const hasCut = cut != null && cut.count > 0;
   const cutOffset = hasCut ? cut.avgCutOffset * 125 : 0;
   const distanceOffset = hasCut ? cut.avgCutOffset * 133 : 0;
   // invert SliceDetails' Unity rotation for browser screen space
   const cutRotation = hasCut ? 90 - cut.avgCutAngle : 0;
   const blockColour = hasCut ? (hand === 'left' ? 'fill-red-500/80' : 'fill-blue-500/80') : 'fill-muted';
   const markerColour = hasCut ? 'fill-white/90' : 'fill-muted-foreground/45';

   return (
      <svg aria-hidden="true" viewBox="0 0 100 100" className="aspect-square w-full drop-shadow-sm">
         <g transform={`rotate(${rotation} 50 50)`}>
            <rect x="16" y="16" width="68" height="68" rx="9" className={blockColour} />
            {dot ? (
               <circle cx="50" cy="50" r="13.5" className={markerColour} />
            ) : (
               <g transform="translate(0 7)" className={markerColour}>
                  <path d="M24 18.5h52a2.5 2.5 0 0 1 2.5 2.5v2.5L50 41.5 21.5 23.5V21a2.5 2.5 0 0 1 2.5-2.5Z" />
                  <circle cx="50" cy="50" r="2.75" />
               </g>
            )}
         </g>

         {hasCut && (
            <g transform={`rotate(${cutRotation} 50 50)`}>
               <path d="M48.25 0h3.5v84l4.5-2.75L50 100l-6.25-18.75L48.25 84Z" transform={`translate(${cutOffset} 0)`} className="fill-white" />
               <rect x={50 + Math.min(0, distanceOffset)} y="0" width={Math.abs(distanceOffset)} height="100" className="fill-emerald-400/65" />
            </g>
         )}
      </svg>
   );
}
