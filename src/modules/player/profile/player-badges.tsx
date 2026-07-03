'use client';

import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';
import { FadeInImage } from '@/shared/components/fade-in-image';

interface PlayerBadgesProps {
   badges: PlayerControllerGetPlayerResponse['badges'];
   badgeOrder?: number[] | null;
   badgeComments?: Record<string, string> | null;
}

export function PlayerBadges({ badges, badgeOrder, badgeComments }: PlayerBadgesProps) {
   const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
   const [openBadgeId, setOpenBadgeId] = useState<number | null>(null);

   if (badges.length === 0) {
      return null;
   }

   const badgesById = new Map(badges.map((badge) => [badge.id, badge]));
   const orderedBadges = badgeOrder ? badgeOrder.map((badgeId) => badgesById.get(badgeId)).filter((badge) => badge !== undefined) : badges;
   const visibleBadges = orderedBadges.filter((badge) => !failedImages.has(badge.image));
   if (visibleBadges.length === 0) return null;

   return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
         {visibleBadges.map((badge) => {
            const comment = badgeComments?.[badge.id]?.trim();

            return (
               <Tooltip
                  key={badge.id}
                  open={openBadgeId === badge.id}
                  onOpenChange={(open) =>
                     setOpenBadgeId((current) => {
                        if (open) return badge.id;
                        return current === badge.id ? null : current;
                     })
                  }
               >
                  <TooltipTrigger asChild>
                     <button
                        type="button"
                        className="focus-visible:ring-ring flex max-w-28 cursor-help flex-col items-center gap-1 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                        onClick={() => setOpenBadgeId((current) => (current === badge.id ? null : badge.id))}
                     >
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
                     </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={4} className="max-w-52 px-2.5 text-center">
                     <p className="font-medium">{badge.description}</p>
                     {comment && <p className="mt-1 opacity-75">{comment}</p>}
                  </TooltipContent>
               </Tooltip>
            );
         })}
      </div>
   );
}
