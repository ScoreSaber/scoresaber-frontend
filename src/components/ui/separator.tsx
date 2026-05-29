'use client';

import * as React from 'react';

import { Separator as SeparatorPrimitive } from 'radix-ui';

import { cn } from '@/shared/format/helpers';

function Separator({
   className,
   orientation = 'horizontal',
   variant = 'default',
   size = 'default',
   decorative = true,
   ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
   variant?: 'default' | 'gradient' | 'fade';
   size?: 'default' | 'toolbar';
}) {
   return (
      <SeparatorPrimitive.Root
         data-slot="separator"
         decorative={decorative}
         orientation={orientation}
         className={cn(
            'shrink-0',
            variant === 'default' && [
               'bg-border',
               'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
               'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px'
            ],
            variant === 'gradient' && [
               'via-muted-foreground/15 from-transparent to-transparent',
               orientation === 'horizontal' && 'h-px w-full bg-linear-to-r',
               orientation === 'vertical' && 'w-px bg-linear-to-b'
            ],
            variant === 'fade' && [
               'via-border from-border to-transparent',
               orientation === 'horizontal' && 'h-px w-full bg-linear-to-r',
               orientation === 'vertical' && 'w-px bg-linear-to-b'
            ],
            size === 'toolbar' && orientation === 'vertical' && 'h-5',
            className
         )}
         {...props}
      />
   );
}

export { Separator };
