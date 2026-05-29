import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/format/helpers';

const badgeVariants = cva(
   'inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
   {
      variants: {
         variant: {
            default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive:
               'bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
            ghost: '[a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
            link: 'text-primary underline-offset-4 [a&]:hover:underline',
            stat: 'rounded-lg px-2 py-1 border-border',
            'stat-accuracy': 'rounded-lg px-2 py-1 border-status-warning',
            'stat-pp': 'rounded-lg px-2 py-1 border-score-pp',
            'stat-score': 'rounded-lg px-2 py-1 border-border',
            'stat-success': 'rounded-lg px-2 py-1 border-score-combo-full text-score-combo-full',
            'stat-error': 'rounded-lg px-2 py-1 border-score-combo-broken text-score-combo-broken',
            difficulty: 'h-5 min-w-2 max-w-12 cursor-default select-none justify-center rounded p-1 text-[10px] text-badge-foreground'
         }
      },
      defaultVariants: {
         variant: 'default'
      }
   }
);

function Badge({
   className,
   variant = 'default',
   asChild = false,
   ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
   const Comp = asChild ? Slot.Root : 'span';

   return <Comp data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />;
}

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean };

export { Badge, badgeVariants, type BadgeProps };
