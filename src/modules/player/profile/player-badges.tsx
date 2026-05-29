'use client';

import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { FadeInImage } from '@/shared/components/fade-in-image';

interface PlayerBadgesProps {
   badges: { id: number; image: string; description: string }[];
}

export function PlayerBadges({ badges }: PlayerBadgesProps) {
   const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

   if (badges.length === 0) {
      return null;
   }

   const visibleBadges = badges.filter((badge) => !failedImages.has(badge.image));
   if (visibleBadges.length === 0) return null;

   return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
         {visibleBadges.map((badge) => (
            <Tooltip key={badge.id}>
               <TooltipTrigger asChild>
                  <div className="cursor-help">
                     <FadeInImage
                        src={badge.image}
                        alt={badge.description}
                        width={80}
                        height={30}
                        className="rounded-sm"
                        style={{ width: 80, height: 30, objectFit: 'contain' }}
                        unoptimized
                        onError={() => setFailedImages((prev) => new Set(prev).add(badge.image))}
                     />
                  </div>
               </TooltipTrigger>
               <TooltipContent side="bottom">
                  <p className="font-medium">{badge.description}</p>
               </TooltipContent>
            </Tooltip>
         ))}
      </div>
   );
}
