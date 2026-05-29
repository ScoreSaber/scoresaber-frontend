import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/format/helpers';

const kbdVariants = cva(
   'bg-muted text-muted-foreground pointer-events-none inline-flex w-fit items-center justify-center gap-1 rounded-sm px-1 font-sans font-medium select-none [[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
   {
      variants: {
         size: {
            default: "h-5 min-w-5 text-xs [&_svg:not([class*='size-'])]:size-3",
            sm: "h-4 min-w-4 text-[10px] [&_svg:not([class*='size-'])]:size-2.5"
         }
      },
      defaultVariants: {
         size: 'default'
      }
   }
);

function Kbd({ className, size, ...props }: React.ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
   return <kbd data-slot="kbd" className={cn(kbdVariants({ size }), className)} {...props} />;
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
   return <div data-slot="kbd-group" className={cn('inline-flex items-center gap-1', className)} {...props} />;
}

export { Kbd, KbdGroup };
