import type { ComponentProps, ReactNode } from 'react';

import { createLink } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function HomeColumn({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
   return (
      <section className="flex min-w-0 flex-col lg:h-[22rem]">
         <div className="mb-3 flex h-9 items-center justify-between gap-4">
            <h2 className="min-w-0 truncate text-[22px] leading-none font-bold">{title}</h2>
            {action}
         </div>
         <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </section>
   );
}

function HomeColumnLinkAnchor({ children, ...props }: ComponentProps<'a'>) {
   return (
      <a {...props} className="text-primary inline-flex min-w-0 shrink items-center gap-1.5 text-sm font-medium">
         <span className="truncate">{children}</span>
         <ArrowRight className="size-3.5 shrink-0" aria-hidden />
      </a>
   );
}

export const HomeColumnLink = createLink(HomeColumnLinkAnchor);

export function HomeColumnEmptyCard({ children }: { children: ReactNode }) {
   return (
      <Card variant="settings" className="min-h-0 flex-1 py-0">
         <div className="text-muted-foreground flex flex-1 items-center justify-center p-6 text-center text-sm">{children}</div>
      </Card>
   );
}
