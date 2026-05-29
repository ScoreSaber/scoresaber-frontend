'use client';

import type { ReactNode } from 'react';

import { FadeInImage } from '@/shared/components/fade-in-image';
import { cn } from '@/shared/format/helpers';
import { BLURRED_BG_IMAGE_CLASSES, CARD_GRADIENT_CLASSES } from '@/shared/format/styling';

interface ScoreCardSurfaceProps {
   children: ReactNode;
   coverUrl?: string | null;
   className?: string;
   imageSizes?: string;
}

export function ScoreCardSurface({ children, coverUrl, className, imageSizes = '(min-width: 1024px) 800px, 100vw' }: ScoreCardSurfaceProps) {
   return (
      <div className={cn(CARD_GRADIENT_CLASSES, 'w-full text-left', className)}>
         {coverUrl && (
            <div className="absolute inset-0 opacity-0 dark:opacity-25">
               <FadeInImage src={coverUrl} alt="" fill className={BLURRED_BG_IMAGE_CLASSES} sizes={imageSizes} />
            </div>
         )}

         <div className="from-background/75 via-background/50 to-background/75 absolute inset-0 hidden bg-linear-to-r dark:block" />

         <div className="relative z-10">{children}</div>
      </div>
   );
}
