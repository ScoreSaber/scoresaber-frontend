'use client';

import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '@/shared/format/helpers';

function Tabs({ className, orientation = 'horizontal', ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
   return (
      <TabsPrimitive.Root
         data-slot="tabs"
         data-orientation={orientation}
         orientation={orientation}
         className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
         {...props}
      />
   );
}

const tabsListVariants = cva(
   'group/tabs-list text-muted-foreground inline-flex items-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
   {
      variants: {
         variant: {
            default: 'w-fit justify-center rounded-lg bg-muted p-0.75 group-data-[orientation=horizontal]/tabs:h-9',
            line: 'w-fit justify-center gap-1 rounded-lg bg-transparent p-0.75 group-data-[orientation=horizontal]/tabs:h-9',
            pill: 'w-full flex-wrap gap-1.5 bg-transparent',
            sidebar: 'w-full items-stretch gap-1.5 bg-transparent p-0'
         }
      },
      defaultVariants: {
         variant: 'default'
      }
   }
);

function TabsList({
   className,
   variant = 'default',
   ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
   return <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), className)} {...props} />;
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
   return (
      <TabsPrimitive.Trigger
         data-slot="tabs-trigger"
         className={cn(
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 cursor-default items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow] group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
            'group-data-[variant=pill]/tabs-list:h-auto group-data-[variant=pill]/tabs-list:flex-none group-data-[variant=pill]/tabs-list:cursor-pointer group-data-[variant=pill]/tabs-list:rounded group-data-[variant=pill]/tabs-list:px-2.5 group-data-[variant=pill]/tabs-list:py-1.5 group-data-[variant=pill]/tabs-list:text-xs group-data-[variant=pill]/tabs-list:shadow-none',
            'group-data-[variant=pill]/tabs-list:data-[state=inactive]:border-border group-data-[variant=pill]/tabs-list:data-[state=inactive]:bg-secondary/35 group-data-[variant=pill]/tabs-list:data-[state=inactive]:text-muted-foreground group-data-[variant=pill]/tabs-list:data-[state=inactive]:hover:bg-secondary/60 group-data-[variant=pill]/tabs-list:data-[state=inactive]:hover:text-foreground',
            'group-data-[variant=pill]/tabs-list:data-[state=active]:border-transparent group-data-[variant=pill]/tabs-list:data-[state=active]:bg-primary group-data-[variant=pill]/tabs-list:data-[state=active]:text-primary-foreground dark:group-data-[variant=pill]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=pill]/tabs-list:data-[state=active]:bg-primary dark:group-data-[variant=pill]/tabs-list:data-[state=active]:text-primary-foreground',
            'group-data-[variant=sidebar]/tabs-list:h-auto group-data-[variant=sidebar]/tabs-list:w-full group-data-[variant=sidebar]/tabs-list:flex-none group-data-[variant=sidebar]/tabs-list:cursor-pointer group-data-[variant=sidebar]/tabs-list:rounded group-data-[variant=sidebar]/tabs-list:px-2.5 group-data-[variant=sidebar]/tabs-list:py-1.5 group-data-[variant=sidebar]/tabs-list:text-xs group-data-[variant=sidebar]/tabs-list:shadow-none',
            'group-data-[variant=sidebar]/tabs-list:data-[state=inactive]:border-border group-data-[variant=sidebar]/tabs-list:data-[state=inactive]:bg-secondary/35 group-data-[variant=sidebar]/tabs-list:data-[state=inactive]:text-muted-foreground group-data-[variant=sidebar]/tabs-list:data-[state=inactive]:hover:bg-secondary/60 group-data-[variant=sidebar]/tabs-list:data-[state=inactive]:hover:text-foreground',
            'group-data-[variant=sidebar]/tabs-list:data-[state=active]:border-transparent group-data-[variant=sidebar]/tabs-list:data-[state=active]:bg-primary group-data-[variant=sidebar]/tabs-list:data-[state=active]:text-primary-foreground dark:group-data-[variant=sidebar]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=sidebar]/tabs-list:data-[state=active]:bg-primary dark:group-data-[variant=sidebar]/tabs-list:data-[state=active]:text-primary-foreground',
            'data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 data-[state=active]:text-foreground',
            'after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-1.25 group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
            className
         )}
         {...props}
      />
   );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
   return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
