'use client';

import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { Result } from 'better-result';
import { Check, Copy, Download, ImageOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

import { ScoreCard } from '@/modules/scores/score-card';
import type { PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { CopyButton } from '@/shared/components/copy-button';

const CARD_WIDTH_MIN = 400;
const CARD_WIDTH_MAX = 900;
const CARD_WIDTH_DEFAULT = 830;
const PADDING_MIN = 0;
const PADDING_MAX = 80;
const PADDING_DEFAULT = 24;
const PREVIEW_EMPTY = { scale: 1, width: 0, height: 0, measured: false };

interface ScoreShareStudioProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   scores: PlayerControllerGetPlayerScoresDataItem[];
   initialScoreId: number | null;
}

export function ScoreShareStudio({ open, onOpenChange, scores, initialScoreId }: ScoreShareStudioProps) {
   const t = useTranslations();

   const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
   const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DEFAULT);
   const [padding, setPadding] = useState(PADDING_DEFAULT);
   const [includeBackground, setIncludeBackground] = useState(false);
   const [saving, setSaving] = useState(false);

   const [stageElement, setStageElement] = useState<HTMLDivElement | null>(null);
   const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(null);
   const [preview, setPreview] = useState(PREVIEW_EMPTY);

   useLayoutEffect(() => {
      if (!open) return;
      setSelectedIds(initialScoreId ? new Set<number>([initialScoreId]) : new Set<number>());
   }, [open, initialScoreId]);

   const selectedScores = useMemo(() => scores.filter((entry) => selectedIds.has(entry.score.id)), [scores, selectedIds]);
   const hasSelection = selectedScores.length > 0;

   const toggleScore = useCallback((id: number) => {
      setSelectedIds((prev) => {
         const next = new Set(prev);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   }, []);

   const measure = useCallback(() => {
      const stage = stageElement;
      const viewport = viewportElement;
      if (!stage || !viewport) {
         setPreview(PREVIEW_EMPTY);
         return;
      }

      const naturalWidth = stage.offsetWidth;
      const naturalHeight = stage.offsetHeight;
      const availableWidth = viewport.clientWidth;
      if (naturalWidth <= 0 || naturalHeight <= 0 || availableWidth <= 0) {
         setPreview(PREVIEW_EMPTY);
         return;
      }

      const nextScale = Math.min(1, availableWidth / naturalWidth);
      setPreview({
         scale: nextScale,
         width: naturalWidth * nextScale,
         height: naturalHeight * nextScale,
         measured: true
      });
   }, [stageElement, viewportElement]);

   useLayoutEffect(() => {
      if (!open || !hasSelection) {
         setPreview(PREVIEW_EMPTY);
         return;
      }

      setPreview(PREVIEW_EMPTY);
      measure();
   }, [measure, selectedScores, cardWidth, padding, open, hasSelection]);

   useLayoutEffect(() => {
      if (!open || !hasSelection || !stageElement || !viewportElement) return;
      const observer = new ResizeObserver(() => measure());
      observer.observe(stageElement);
      observer.observe(viewportElement);
      measure();
      return () => observer.disconnect();
   }, [open, measure, hasSelection, stageElement, viewportElement]);

   const capture = useCallback(async () => {
      const stage = stageElement;
      if (!stage) throw new Error('nothing to capture');
      const { toBlob } = await import('html-to-image');
      const backgroundColor = includeBackground ? getComputedStyle(stage).getPropertyValue('--background').trim() || undefined : undefined;
      const blob = await toBlob(stage, { pixelRatio: 2, cacheBust: true, backgroundColor });
      if (!blob) throw new Error('capture produced no image');
      return blob;
   }, [includeBackground, stageElement]);

   const fileName = useMemo(() => {
      if (selectedScores.length === 1) {
         const slug =
            selectedScores[0].leaderboard.map.songName
               .toLowerCase()
               .replace(/[^a-z0-9]+/g, '-')
               .replace(/^-+|-+$/g, '') || 'score';
         return `${slug}-scoresaber.png`;
      }
      return 'scoresaber-scores.png';
   }, [selectedScores]);

   const copyImage = useCallback(
      () =>
         Result.tryPromise(async () => {
            if (!window.ClipboardItem || !navigator.clipboard?.write) {
               throw new Error('clipboard unsupported');
            }
            await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': capture() })]);
         }),
      [capture]
   );

   const saveImage = useCallback(async () => {
      setSaving(true);
      const result = await Result.tryPromise(async () => {
         const blob = await capture();
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = fileName;
         link.click();
         URL.revokeObjectURL(url);
      });
      setSaving(false);
      if (Result.isError(result)) toast.error(t('score.share.saveFailed'));
   }, [capture, fileName, t]);

   const actionsDisabled = !hasSelection || !preview.measured || saving;

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0 sm:max-w-3xl sm:gap-4 sm:p-6">
            <DialogHeader className="px-4 pt-5 pb-3 text-left sm:px-0 sm:pt-0 sm:pb-0">
               <DialogTitle>{t('score.share.title')}</DialogTitle>
               <DialogDescription className="text-pretty">{t('score.share.description')}</DialogDescription>
            </DialogHeader>

            <div className="flex min-h-0 flex-col gap-4 overflow-y-auto px-4 pb-4 sm:px-0 sm:pb-0">
               <div className="bg-muted/20 flex max-h-[28dvh] min-h-24 shrink-0 overflow-auto rounded-md border p-2 sm:max-h-[46vh] sm:min-h-32 sm:p-3">
                  {hasSelection ? (
                     <div ref={setViewportElement} className="flex min-h-full w-full">
                        <div className="relative m-auto shrink-0" style={{ width: preview.width || undefined, height: preview.height || undefined }}>
                           <div
                              className="absolute top-0 left-0 origin-top-left"
                              style={{ opacity: preview.measured ? 1 : 0, transform: `scale(${preview.scale})` }}
                           >
                              <div
                                 ref={setStageElement}
                                 className="w-fit"
                                 style={{ padding, backgroundColor: includeBackground ? 'var(--background)' : undefined }}
                              >
                                 <div className="flex flex-col gap-2" style={{ width: cardWidth }}>
                                    {selectedScores.map((entry) => (
                                       <ScoreCard key={entry.score.id} presentation playerScore={entry} className="p-3" />
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="text-muted-foreground m-auto flex flex-col items-center gap-2 py-8 text-sm">
                        <ImageOff className="size-6 opacity-40" />
                        <p>{t('score.share.emptyPreview')}</p>
                     </div>
                  )}
               </div>

               <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex flex-1 flex-col gap-2">
                     <div className="flex items-center justify-between text-sm font-medium">
                        <span>{t('score.share.width')}</span>
                        <span className="text-muted-foreground tabular-nums">{cardWidth}px</span>
                     </div>
                     <Slider
                        value={[cardWidth]}
                        min={CARD_WIDTH_MIN}
                        max={CARD_WIDTH_MAX}
                        step={20}
                        onValueChange={(value) => setCardWidth(value[0])}
                        aria-label={t('score.share.width')}
                     />
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                     <div className="flex items-center justify-between text-sm font-medium">
                        <span>{t('score.share.padding')}</span>
                        <span className="text-muted-foreground tabular-nums">{padding}px</span>
                     </div>
                     <Slider
                        value={[padding]}
                        min={PADDING_MIN}
                        max={PADDING_MAX}
                        step={4}
                        onValueChange={(value) => setPadding(value[0])}
                        aria-label={t('score.share.padding')}
                     />
                  </div>
               </div>

               <label className="flex shrink-0 cursor-default items-center gap-2 text-sm font-medium">
                  <Checkbox checked={includeBackground} onCheckedChange={(checked) => setIncludeBackground(checked === true)} />
                  <span>{t('score.share.addBackground')}</span>
               </label>

               <div className="flex min-h-0 flex-1 flex-col gap-2">
                  <span className="text-sm font-medium">{t('score.share.rows', { count: selectedScores.length })}</span>
                  <div className="min-h-0 flex-1 overflow-y-auto rounded-md border sm:max-h-44">
                     {scores.map((entry) => (
                        <label
                           key={entry.score.id}
                           className="hover:bg-muted/50 flex min-h-12 cursor-default items-center gap-3 border-b px-3 py-2 text-sm last:border-b-0"
                        >
                           <Checkbox checked={selectedIds.has(entry.score.id)} onCheckedChange={() => toggleScore(entry.score.id)} />
                           <span className="min-w-0 flex-1 truncate">{entry.leaderboard.map.songName}</span>
                           <span className="text-muted-foreground shrink-0 tabular-nums">#{entry.score.rank}</span>
                        </label>
                     ))}
                  </div>
               </div>
            </div>

            <DialogFooter className="bg-background border-t p-4 sm:border-t-0 sm:p-0">
               <CopyButton copyAction={copyImage} disabled={actionsDisabled} errorMessage={t('score.share.copyFailed')}>
                  {({ buttonProps, copied }) => (
                     <Button variant="outline" {...buttonProps}>
                        {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                        {copied ? t('score.share.copied') : t('score.share.copy')}
                     </Button>
                  )}
               </CopyButton>
               <Button onClick={saveImage} disabled={actionsDisabled}>
                  {saving ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Download data-icon="inline-start" />}
                  {t('score.share.save')}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
