'use client';

import { type ComponentProps, useState } from 'react';

import { useAuth } from '@/modules/auth';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { cn } from '@/shared/format/helpers';

type PlayerAvatarProps = Omit<ComponentProps<typeof FadeInImage>, 'onError'> & {
   playerId?: string;
};

export function PlayerAvatar({ className, alt, src, playerId, ...props }: PlayerAvatarProps) {
   const [hasError, setHasError] = useState(false);
   const { style, width, height, ...imageProps } = props;
   const boxStyle = { width: width ?? undefined, height: height ?? undefined, ...style };
   const cacheBustedSrc = usePlayerAvatarSrc(typeof src === 'string' ? src : undefined, playerId);
   const imageSrc = typeof src === 'string' ? cacheBustedSrc : src;

   if (hasError) {
      return <div className={cn('bg-muted shrink-0 overflow-hidden rounded-full', className)} style={boxStyle} />;
   }

   return (
      <span className={cn('relative inline-flex shrink-0 overflow-hidden rounded-full', className)} style={boxStyle}>
         <FadeInImage
            {...imageProps}
            src={imageSrc}
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

function getCacheBustedPlayerAvatarSrc(src: string | undefined, cacheBust: string | null) {
   if (!src || !cacheBust || src.startsWith('/') || src.startsWith('blob:') || src.startsWith('data:')) {
      return src;
   }

   try {
      const url = new URL(src);
      url.searchParams.set('v', cacheBust);
      return url.toString();
   } catch {
      return src;
   }
}

function usePlayerAvatarSrc(src: string | undefined, playerId?: string) {
   const { user, avatarCacheBust } = useAuth();
   return playerId && playerId === user?.id ? getCacheBustedPlayerAvatarSrc(src, avatarCacheBust) : src;
}

export { getCacheBustedPlayerAvatarSrc, usePlayerAvatarSrc };
