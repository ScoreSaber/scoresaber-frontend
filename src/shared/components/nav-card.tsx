'use client';

import { useRouter } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/shared/format/helpers';
import { isRouterClick, navigateToRoute, type RouteLocation } from '@/shared/url-state/route-location';
import { useRouteHrefPreload } from '@/shared/url-state/use-route-href-preload';

export const NAV_CARD_ABOVE_OVERLAY = 'relative z-40';

export const NAV_CARD_PRESS = 'transition-[scale] duration-150 has-[[data-nav-overlay]:active]:scale-[0.98]';

export function NavCardOverlay<const TLocation>({ location, className }: { location: RouteLocation<TLocation>; className?: string }) {
   const router = useRouter();
   const { getHref, preloadNow } = useRouteHrefPreload();

   return (
      <a
         data-nav-overlay
         aria-hidden="true"
         tabIndex={-1}
         href={getHref(location)}
         onTouchStart={() => preloadNow(location)}
         onClick={(event) => {
            if (!isRouterClick(event)) return;
            event.preventDefault();
            event.stopPropagation();
            void navigateToRoute(router, location);
         }}
         className={cn('absolute inset-0 z-30 hidden pointer-coarse:block', className)}
      />
   );
}

export function NavCardChevron({ className }: { className?: string }) {
   return <ChevronRight aria-hidden="true" className={cn('text-muted-foreground hidden size-4 shrink-0 pointer-coarse:block', className)} />;
}
