'use client';

import { type ComponentProps, useState } from 'react';

import { FadeInImage } from '@/shared/components/fade-in-image';
import { cn } from '@/shared/format/helpers';

type PlayerAvatarProps = Omit<ComponentProps<typeof FadeInImage>, 'onError'> & {
   version?: number;
};

export function versionedAvatarUrl(src: string, version?: number) {
   return versionedImageUrl(src, version);
}

export function versionedImageUrl(src: string, version?: number | null) {
   return version ? `${src}?v=${version}` : src;
}

export function PlayerAvatar({ className, alt, src, version, ...props }: PlayerAvatarProps) {
   const [hasError, setHasError] = useState(false);

   const { style, width, height, ...imageProps } = props;
   const boxStyle = { width: width ?? undefined, height: height ?? undefined, ...style };

   if (hasError) {
      return <div className={cn('bg-muted shrink-0 overflow-hidden rounded-full', className)} style={boxStyle} />;
   }

   return (
      <span className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full', className)} style={boxStyle}>
         <FadeInImage
            {...imageProps}
            src={src === undefined ? undefined : versionedImageUrl(src, version)}
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
