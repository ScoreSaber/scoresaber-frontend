'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useState } from 'react';

import { ExternalLink, Loader2, Play } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { getReplayArcviewerUrl } from '@/shared/arcviewer-url';
import { cn } from '@/shared/format/helpers';

interface ReplayDialogProps {
   scoreId: number;
   trigger: (props: ReplayTriggerProps) => ReactNode;
   tooltip?: string;
   tooltipDelayMs?: number;
   tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

interface ReplayTriggerProps {
   replayUrl: string;
   openReplayAction: (event: MouseEvent<HTMLElement>) => void;
}

export function ReplayDialog({ scoreId, trigger, tooltip, tooltipDelayMs, tooltipSide }: ReplayDialogProps) {
   const t = useTranslations();
   const [loaded, setLoaded] = useState(false);
   const [open, setOpen] = useState(false);
   const [tooltipOpen, setTooltipOpen] = useState(false);
   const replayUrl = getReplayUrl(scoreId);
   const openReplayAction = (event: MouseEvent<HTMLElement>) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      setOpen(true);
      setTooltipOpen(false);
   };
   const renderedTrigger = trigger({ replayUrl, openReplayAction });

   const wrappedTrigger = tooltip ? (
      <Tooltip open={tooltipOpen && !open} onOpenChange={setTooltipOpen} delayDuration={tooltipDelayMs}>
         <TooltipTrigger asChild>{renderedTrigger}</TooltipTrigger>
         <TooltipContent side={tooltipSide}>
            <p>{tooltip}</p>
         </TooltipContent>
      </Tooltip>
   ) : (
      renderedTrigger
   );

   return (
      <Dialog
         open={open}
         onOpenChange={(next) => {
            setOpen(next);
            if (!next) setLoaded(false);
         }}
      >
         {wrappedTrigger}
         <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[90vw]" aria-describedby={undefined} showCloseButton>
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Play className="size-4" />
                  {t('score.replayViewer')}
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <a
                           href={replayUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           aria-label={t('score.openReplayNewTab')}
                           className="text-muted-foreground hover:text-primary transition-colors"
                        >
                           <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                     </TooltipTrigger>
                     <TooltipContent>
                        <p>{t('score.openInNewTab')}</p>
                     </TooltipContent>
                  </Tooltip>
               </DialogTitle>
            </DialogHeader>
            <div className="bg-card relative aspect-video max-h-[80vh] w-full overflow-hidden rounded-md border">
               {!loaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
                  </div>
               )}
               {open && (
                  <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                     {/* slight overscan hides arcviewer edge artifacts */}
                     <iframe
                        src={replayUrl}
                        title={t('score.replayViewer')}
                        className={cn(
                           'absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] border-0 bg-black transition-opacity duration-300',
                           loaded ? 'animate-in fade-in opacity-100 duration-300' : 'opacity-0'
                        )}
                        onLoad={() => setLoaded(true)}
                        allow="autoplay"
                        referrerPolicy="no-referrer"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
                        allowFullScreen
                     />
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}

function getReplayUrl(scoreId: number) {
   return getReplayArcviewerUrl({
      ssScoreId: scoreId.toString(),
      autoPlay: 'true'
   });
}
