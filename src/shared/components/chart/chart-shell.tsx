import type { ReactNode } from 'react';

import { cn } from '@/shared/format/helpers';

export function ChartShell({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
   return (
      <div id={id} className={cn('bg-card relative w-full rounded-lg border', className)}>
         {children}
      </div>
   );
}
