'use client';

import { type KeyboardEvent, type ReactNode } from 'react';

import { CopyButton } from '@/shared/components/copy-button';
import { cn } from '@/shared/format/helpers';

export type CopyableCodePillVariant = 'link' | 'copy';
export type CopyableCodePillSize = 'xs' | 'sm';

export function CopyableCodePill({
   value,
   href,
   icon,
   variant = 'copy',
   size = 'sm',
   className
}: {
   value: string;
   href?: string;
   icon?: ReactNode;
   variant?: CopyableCodePillVariant;
   size?: CopyableCodePillSize;
   className?: string;
}) {
   const isCopyVariant = variant === 'copy';

   function stopKeyDown(event: KeyboardEvent<HTMLElement>) {
      event.stopPropagation();
   }

   const valueClassName = 'min-w-0 truncate font-mono';

   return (
      <span
         className={cn(
            'text-muted-foreground inline-flex min-w-0 shrink-0 items-center rounded border font-medium transition-colors',
            size === 'xs' ? 'gap-1 px-1.5 py-0.5 text-[10px] leading-none' : 'gap-1.5 px-2 py-1 text-xs leading-none',
            className
         )}
      >
         {icon ? <span className={cn('shrink-0 [&_svg]:shrink-0', size === 'xs' ? '[&_svg]:size-2' : '[&_svg]:size-2.5')}>{icon}</span> : null}
         {href ? (
            <a
               href={href}
               target="_blank"
               rel="noopener noreferrer"
               className={cn('hover:text-primary transition-colors', valueClassName)}
               onClick={(event) => event.stopPropagation()}
               onKeyDown={stopKeyDown}
            >
               {value}
            </a>
         ) : (
            <span className={valueClassName}>{value}</span>
         )}
         {isCopyVariant ? (
            <>
               <span className="text-border shrink-0" aria-hidden="true">
                  |
               </span>
               <CopyButton value={value} size={size} stopPropagation onKeyDown={stopKeyDown} className="shrink-0" />
            </>
         ) : null}
      </span>
   );
}
