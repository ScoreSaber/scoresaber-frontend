import type { ImgHTMLAttributes } from 'react';

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

export function Image({ priority: _priority, fill, unoptimized: _unoptimized, style, alt, ...props }: ImageProps) {
   return (
      <img
         {...props}
         alt={alt}
         style={fill ? { ...style, position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } : style}
      />
   );
}
