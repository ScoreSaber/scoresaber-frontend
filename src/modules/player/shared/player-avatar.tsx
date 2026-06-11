'use client';

import { type ComponentProps, useEffect, useState } from 'react';

import { repairCachedAvatar } from './avatar-cache-repair';

import { FadeInImage } from '@/shared/components/fade-in-image';
import { cn } from '@/shared/format/helpers';

type PlayerAvatarProps = Omit<ComponentProps<typeof FadeInImage>, 'onError'>;

export function PlayerAvatar({ className, alt, src, ...props }: PlayerAvatarProps) {
   const [hasError, setHasError] = useState(false);

   useEffect(() => {
      repairCachedAvatar(src);
   }, [src]);

   const { style, width, height, ...imageProps } = props;
   const boxStyle = { width: width ?? undefined, height: height ?? undefined, ...style };

   if (hasError) {
      return <div className={cn('bg-muted shrink-0 overflow-hidden rounded-full', className)} style={boxStyle} />;
   }

   return (
      <span className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full', className)} style={boxStyle}>
         <FadeInImage
            {...imageProps}
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill
            className="object-cover"
            onError={() => setHasError(true)}
         />
      </span>
   );
}
