'use client';

import { useEffect, useState } from 'react';

import { Result } from 'better-result';
import { ArrowUpRight, Radio, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { readStorageValue, writeStorageValue } from '@/shared/result/storage';

const WATCH_PARTY_URL = 'https://watch.scoresaber.com/?party=76561198283584459';
const WATCH_PARTY_NOTICE_DISMISSED_STORAGE_KEY = 'scoresaber-watch-party-notice-dismissed-2026-07';

export function WatchPartyNotice() {
   const t = useTranslations('home.watchParty');
   const [open, setOpen] = useState(false);

   useEffect(() => {
      setOpen(Result.unwrapOr(readStorageValue(WATCH_PARTY_NOTICE_DISMISSED_STORAGE_KEY), null) !== 'true');
   }, []);

   if (!open) return null;

   const dismiss = () => {
      setOpen(false);
      writeStorageValue(WATCH_PARTY_NOTICE_DISMISSED_STORAGE_KEY, 'true');
   };

   return (
      <Card variant="settings" className="bg-card/95 w-full gap-0 overflow-hidden border-white/20 py-0 shadow-2xl shadow-black/20 backdrop-blur">
         <div className="relative flex h-28 items-center justify-center overflow-hidden border-b border-white/10 bg-black/20">
            <div className="bg-primary/12 absolute inset-0 blur-3xl" />
            <div className="border-primary/10 absolute size-36 rounded-full border" />
            <div className="border-primary/20 absolute size-24 rounded-full border" />
            <div className="border-primary/30 absolute size-12 rounded-full border" />
            <div className="bg-primary/20 absolute size-16 animate-pulse rounded-full blur-xl motion-reduce:animate-none" />
            <div className="bg-background/80 ring-primary/25 relative flex size-10 items-center justify-center rounded-full ring-1 backdrop-blur">
               <Radio className="text-primary size-4" aria-hidden />
            </div>

            <Button
               size="icon-xs"
               variant="ghost-icon"
               className="bg-background/65 text-foreground/80 hover:bg-background/80 absolute top-2 right-2 cursor-pointer backdrop-blur"
               aria-label={t('dismiss')}
               onClick={dismiss}
            >
               <X />
            </Button>
         </div>

         <div className="flex flex-col items-center gap-3 p-4 text-center">
            <div className="font-semibold">{t('title')}</div>

            <Button asChild size="sm" className="w-full">
               <a href={WATCH_PARTY_URL} target="_blank" rel="noreferrer" onClick={dismiss}>
                  {t('action')}
                  <ArrowUpRight data-icon />
               </a>
            </Button>
         </div>
      </Card>
   );
}
