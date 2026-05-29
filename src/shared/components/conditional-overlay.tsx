import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/shared/format/helpers';

interface ConditionalOverlayProps<TProps extends object = Record<string, never>> {
   children: ReactNode;
   shouldShow: () => boolean;
   component: ComponentType<TProps>;
   componentProps: TProps;
   className?: string;
   contentClassName?: string;
   overlayClassName?: string;
}

export function ConditionalOverlay<TProps extends object>({
   children,
   shouldShow,
   component: OverlayComponent,
   componentProps,
   className,
   contentClassName,
   overlayClassName
}: ConditionalOverlayProps<TProps>) {
   const show = shouldShow();

   return (
      <div className={cn('relative overflow-hidden', className)}>
         <div
            className={cn('rounded-[inherit]', show && 'pointer-events-none select-none opacity-35', contentClassName)}
            inert={show}
            aria-hidden={show}
         >
            {children}
         </div>
         {show && (
            <div className={cn('absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/70 p-4', overlayClassName)}>
               <OverlayComponent {...componentProps} />
            </div>
         )}
      </div>
   );
}
