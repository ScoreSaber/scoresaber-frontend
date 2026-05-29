import { forwardRef } from 'react';

import type { IconType } from 'react-icons';

import { cn } from '@/shared/format/helpers';

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
   icon: IconType | React.ComponentType<{ className?: string }>;
   label?: string;
   children: React.ReactNode;
   labelClassName?: string;
   valueClassName?: string;
   iconClassName?: string;
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(
   ({ icon: Icon, label, children, className, labelClassName, valueClassName, iconClassName, ...props }, ref) => {
      return (
         <div
            ref={ref}
            className={cn('bg-secondary/35 text-muted-foreground inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs', className)}
            {...props}
         >
            <Icon className={cn('h-3 w-3 shrink-0', iconClassName)} />
            {label ? <span className={cn('cursor-default select-none', labelClassName)}>{label}</span> : null}
            <span className={cn('text-foreground font-semibold', valueClassName)}>{children}</span>
         </div>
      );
   }
);
