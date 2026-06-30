'use client';

import * as React from 'react';

import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '@/shared/format/helpers';

function TooltipProvider({ delayDuration = 300, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
   return <TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props} />;
}

type TooltipState = {
   isPointerOver: React.RefObject<boolean>;
};

const TooltipContext = React.createContext<TooltipState | null>(null);
TooltipContext.displayName = 'TooltipContext';

function Tooltip({
   open: controlledOpen,
   onOpenChange: controlledOnOpenChange,
   suppressFocusOpen = false,
   children,
   ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
   suppressFocusOpen?: boolean;
}) {
   const isControlled = controlledOpen !== undefined;
   const isPointerOver = React.useRef(false);

   const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

   const tooltipState = React.useMemo<TooltipState>(() => ({ isPointerOver }), []);

   const open = isControlled ? controlledOpen : uncontrolledOpen;
   const onOpenChange = React.useCallback(
      (nextOpen: boolean) => {
         if (suppressFocusOpen && nextOpen && !isPointerOver.current) {
            return;
         }
         if (isControlled) {
            controlledOnOpenChange?.(nextOpen);
            return;
         }
         setUncontrolledOpen(nextOpen);
      },
      [isControlled, controlledOnOpenChange, suppressFocusOpen]
   );

   return (
      <TooltipContext.Provider value={tooltipState}>
         <TooltipPrimitive.Root data-slot="tooltip" open={open} onOpenChange={onOpenChange} {...props}>
            {children}
         </TooltipPrimitive.Root>
      </TooltipContext.Provider>
   );
}

function TooltipTrigger({ onPointerEnter, onPointerLeave, children, asChild, ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
   const tooltip = React.useContext(TooltipContext);

   const handlePointerEnter = React.useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
         if (tooltip && e.pointerType !== 'touch') {
            tooltip.isPointerOver.current = true;
         }
         onPointerEnter?.(e);
      },
      [tooltip, onPointerEnter]
   );

   const handlePointerLeave = React.useCallback(
      (e: React.PointerEvent<HTMLButtonElement>) => {
         if (tooltip) tooltip.isPointerOver.current = false;
         onPointerLeave?.(e);
      },
      [tooltip, onPointerLeave]
   );

   return (
      <TooltipPrimitive.Trigger
         data-slot="tooltip-trigger"
         asChild={asChild}
         onPointerEnter={handlePointerEnter}
         onPointerLeave={handlePointerLeave}
         {...props}
      >
         {children}
      </TooltipPrimitive.Trigger>
   );
}

function TooltipContent({ className, sideOffset = 0, children, style, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
   return (
      <TooltipPrimitive.Portal>
         <TooltipPrimitive.Content
            data-slot="tooltip-content"
            sideOffset={sideOffset}
            className={cn(
               'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 pointer-events-none z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
               className
            )}
            style={{
               backgroundColor: 'var(--profile-accent, var(--primary))',
               color: 'var(--profile-accent-foreground, var(--primary-foreground))',
               ...style
            }}
            {...props}
         >
            {children}
            <TooltipPrimitive.Arrow
               className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs"
               style={{
                  backgroundColor: 'var(--profile-accent, var(--primary))',
                  fill: 'var(--profile-accent, var(--primary))'
               }}
            />
         </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
   );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
