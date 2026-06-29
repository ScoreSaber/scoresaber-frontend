'use client';

import type { ReactNode } from 'react';

import { ExternalLink, LockKeyhole } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { Icons } from '@/shared/components/icons';
import { SupporterGateActions } from '@/shared/components/supporter-gate-actions';
import { cn } from '@/shared/format/helpers';

interface SupporterFeatureLockProps {
   children: ReactNode;
   locked: boolean;
   patreonConnected: boolean;
   variant?: 'floating' | 'field';
   className?: string;
   contentClassName?: string;
   title?: ReactNode;
   description?: ReactNode;
}

export function SupporterFeatureLock({
   children,
   locked,
   patreonConnected,
   variant = 'floating',
   className,
   contentClassName,
   title,
   description
}: SupporterFeatureLockProps) {
   const t = useTranslations();
   const lockTitle = title ?? t('supporterGate.title');
   const lockDescription = description ?? (patreonConnected ? t('supporterGate.subscribeDescription') : t('supporterGate.connectDescription'));

   return (
      <div className={cn('relative', locked && 'overflow-hidden', className)}>
         <div className={cn(locked && 'pointer-events-none select-none opacity-45', contentClassName)} inert={locked} aria-hidden={locked}>
            {children}
         </div>
         {locked &&
            (variant === 'field' ? (
               <>
                  <div className="from-background/10 via-background/70 to-background pointer-events-none absolute inset-0 bg-linear-to-r" />
                  <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 sm:right-4 sm:left-auto sm:w-[min(38rem,calc(100%-2rem))]">
                     <div className="flex items-center justify-end gap-3">
                        <span className="border-border/60 bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur">
                           <Icons.patreon className="size-4 fill-current" aria-hidden />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                           <p className="truncate text-sm font-semibold">{lockTitle}</p>
                           <p className="text-muted-foreground line-clamp-2 text-xs leading-snug text-pretty">{lockDescription}</p>
                        </div>
                        <Button asChild size="xs" className="shrink-0 cursor-pointer">
                           <a href="https://patreon.com/scoresaber" target="_blank" rel="noreferrer">
                              <ExternalLink data-icon="inline-start" />
                              {t('supporterGate.supportUs')}
                           </a>
                        </Button>
                     </div>
                  </div>
               </>
            ) : (
               <>
                  <div className="from-background/15 via-background/65 to-background/95 pointer-events-none absolute inset-0 bg-linear-to-br" />
                  <div className="bg-background/95 absolute right-3 bottom-3 left-3 rounded-md border p-3 shadow-sm backdrop-blur sm:left-auto sm:w-72">
                     <div className="flex items-start gap-3">
                        <span className="border-border/60 bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full border">
                           <LockKeyhole className="size-4" aria-hidden />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                           <div className="flex flex-col gap-0.5">
                              <p className="text-sm font-semibold">{lockTitle}</p>
                              <p className="text-muted-foreground text-xs text-pretty">{lockDescription}</p>
                           </div>
                           <SupporterGateActions size="xs" align="start" />
                        </div>
                     </div>
                  </div>
               </>
            ))}
      </div>
   );
}
