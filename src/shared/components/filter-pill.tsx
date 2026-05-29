'use client';

import { Button } from '@/components/ui/button';

import { cn } from '@/shared/format/helpers';

interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   active?: boolean;
   icon?: React.ComponentType<{ className?: string }>;
}

export function FilterPill({ active, icon: Icon, className, children, ...props }: FilterPillProps) {
   return (
      <Button
         variant={active ? 'default' : 'secondary'}
         className={cn(
            'h-auto gap-1 rounded-full border border-transparent px-2.5 py-1 text-xs sm:px-3 sm:py-1.5',
            !active && 'border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
            className
         )}
         {...props}
      >
         {Icon && <Icon className="size-2.5 sm:size-3" />}
         {children}
      </Button>
   );
}
