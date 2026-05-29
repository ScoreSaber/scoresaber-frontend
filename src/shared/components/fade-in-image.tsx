'use client';

import { type ComponentProps, type CSSProperties, memo, useEffect, useRef, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/shared/format/helpers';

// next/image carries a lot of per-instance overhead (two contexts, multiple
// hooks, getImgProps + an inner ImageElement wrapper, plus image.decode on
// load). with `images.unoptimized: true` set globally there's no benefit, so
// we render a plain <img> here. callers can still pass `fill`/`sizes` for api
// compatibility -- sizes is ignored, fill maps to absolute positioning.
type FadeInImageProps = Omit<ComponentProps<'img'>, 'ref'> & {
   fill?: boolean;
   sizes?: string;
   unoptimized?: boolean;
   priority?: boolean;
};

const FILL_STYLE: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

function FadeInImageImpl({ className, onLoad, fill, sizes: _sizes, unoptimized: _unoptimized, priority, style, ...props }: FadeInImageProps) {
   const [isLoaded, setIsLoaded] = useState(false);
   const imgRef = useRef<HTMLImageElement>(null);

   // pull rounded-* classes so the skeleton matches
   const roundedClasses =
      !isLoaded && className
         ? className
              .split(/\s+/)
              .filter((c) => /^(?:[\w-]+:)*rounded/.test(c))
              .join(' ')
         : '';

   // check if image is already cached after hydration
   useEffect(() => {
      const img = imgRef.current;
      if (img?.complete && img.naturalWidth > 0) {
         setIsLoaded(true);
      }
   }, []);

   const mergedStyle = fill ? (style ? { ...FILL_STYLE, ...style } : FILL_STYLE) : style;

   return (
      <div className={cn('relative', fill ? 'absolute inset-0' : 'inline-flex')}>
         {!isLoaded && <Skeleton className={cn('absolute inset-0', roundedClasses)} />}
         {/* oxlint-disable-next-line nextjs/no-img-element */}
         <img
            {...props}
            ref={imgRef}
            loading={priority ? 'eager' : undefined}
            style={mergedStyle}
            className={className}
            onLoad={(e) => {
               setIsLoaded(true);
               onLoad?.(e);
            }}
         />
      </div>
   );
}

export const FadeInImage = memo(FadeInImageImpl);
