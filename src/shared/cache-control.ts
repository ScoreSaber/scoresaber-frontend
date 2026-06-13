type PublicCacheOptions = {
   maxAge?: number;
   sMaxAge: number;
   staleWhileRevalidate: number;
};

export function publicCacheControl({ maxAge, sMaxAge, staleWhileRevalidate }: PublicCacheOptions) {
   return ['public', ...(maxAge == null ? [] : [`max-age=${maxAge}`]), `s-maxage=${sMaxAge}`, `stale-while-revalidate=${staleWhileRevalidate}`].join(
      ', '
   );
}
