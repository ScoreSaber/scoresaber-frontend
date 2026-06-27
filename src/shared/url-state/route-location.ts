import type { RegisteredRouter, ValidateNavigateOptions } from '@tanstack/react-router';

type BuildLocationOptions = Parameters<RegisteredRouter['buildLocation']>[0];

type RouteNavigationOptions = {
   replace?: boolean;
   resetScroll?: boolean;
};

export type RouteLocation<TLocation> = ValidateNavigateOptions<RegisteredRouter, TLocation>;
export type RouteLocationBuilder<TSearch, TLocation> = (search?: TSearch) => RouteLocation<TLocation>;

export function getRouteHref<const TLocation>(router: RegisteredRouter, location: RouteLocation<TLocation>) {
   return router.buildLocation(location as BuildLocationOptions).href;
}

export function navigateToRoute<const TLocation>(router: RegisteredRouter, location: RouteLocation<TLocation>, options: RouteNavigationOptions = {}) {
   return router.navigate({ ...location, ...options });
}

export function preloadRouteLocation<const TLocation>(router: RegisteredRouter, location: RouteLocation<TLocation>) {
   return router.preloadRoute(location);
}
