import type { CSSProperties, ImgHTMLAttributes } from 'react';

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
   src: string;
   alt: string;
   width?: number;
   height?: number;
   priority?: boolean;
   fill?: boolean;
   sizes?: string;
   unoptimized?: boolean;
};

export function Image({ priority, fill, unoptimized: _unoptimized, style, alt, loading, fetchPriority, ...props }: ImageProps) {
   const imageStyle: CSSProperties = fill
      ? { ...style, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', color: 'transparent' }
      : { ...style, color: 'transparent' };

   return <img {...props} alt={alt} loading={priority ? 'eager' : loading} fetchPriority={priority ? 'high' : fetchPriority} style={imageStyle} />;
}
