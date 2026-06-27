'use client';

import { useEffect, useMemo, useState } from 'react';

import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { useLocation } from '@tanstack/react-router';
import { Result } from 'better-result';
import { CalendarDays, Clock3, ExternalLink, Trophy, X } from 'lucide-react';
import { FaTwitch } from 'react-icons/fa';
import { useLocale, useTranslations } from 'use-intl';

import type { HomeBswcMatch, HomeBswcPromo, HomeBswcTeam } from './actions/bswc';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { FadeInImage } from '@/shared/components/fade-in-image';
import { cn } from '@/shared/format/helpers';
import { readStorageValue, writeStorageValue } from '@/shared/result/storage';

type CountdownPart = {
   key: 'days' | 'hours' | 'minutes' | 'seconds';
   value: number;
};

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const BSWC_PROMO_IMAGE_URL = '/images/bswc-2026-promo.webp';
const BSWC_LIVE_NOTICE_DISMISSED_MATCH_STORAGE_KEY = 'scoresaber-bswc-live-notice-dismissed-match';

export function BswcPromoSection({ promo, previewLive = false }: { promo: HomeBswcPromo | null; previewLive?: boolean }) {
   const t = useTranslations('home');
   const [now, setNow] = useState(() => Date.now());
   const { featuredMatch, live } = getBswcPromoState(promo, previewLive);
   const countdownParts = useMemo(() => getCountdownParts(featuredMatch?.startsAt, now), [featuredMatch?.startsAt, now]);

   useEffect(() => {
      if (!featuredMatch || live) return;

      const intervalId = window.setInterval(() => setNow(Date.now()), SECOND_MS);
      return () => window.clearInterval(intervalId);
   }, [featuredMatch, live]);

   if (!promo) return null;

   return (
      <Card variant="settings" className="gap-0 overflow-hidden border-white/20 py-0 md:flex-row">
         <BswcMedia promo={promo} live={live} />

         <div className="relative flex flex-1 flex-col justify-start gap-3 p-3 pt-2 pb-7 sm:p-5 sm:pt-4 sm:pb-7 lg:p-6 lg:pt-5 lg:pb-6">
            <div className="flex flex-col gap-1.5">
               <h2 className="text-2xl leading-tight font-bold sm:text-3xl">{promo.name}</h2>
               <p className="text-muted-foreground max-w-3xl text-center text-sm leading-relaxed sm:text-[15px] md:text-left">
                  {promo.summary ?? t('bswc.description')}
               </p>
            </div>

            {featuredMatch ? (
               <div className="flex flex-col">
                  <Separator variant="fade" className="from-white/20 via-white/20" />
                  <div
                     className={
                        live ? 'grid justify-items-center gap-3 py-2' : 'grid gap-3 py-2 md:grid-cols-[minmax(0,1fr)_auto_9rem] md:items-center'
                     }
                  >
                     <div
                        className={
                           live
                              ? 'flex min-w-0 flex-col items-center gap-2 text-center'
                              : 'flex min-w-0 flex-col items-center gap-2 text-center md:items-start md:text-left'
                        }
                     >
                        <div className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
                           {live ? t('bswc.liveNow') : t('bswc.nextUp')}
                        </div>
                        <BswcMatchupLine match={featuredMatch} className={live ? undefined : 'md:justify-start'} />
                     </div>

                     {!live && (
                        <>
                           <Separator orientation="vertical" variant="gradient" className="hidden self-stretch md:block" />

                           <div className="grid min-w-0 grid-cols-[1rem_auto_1rem] items-center justify-center gap-3 md:flex md:justify-self-end">
                              <Clock3 className="text-primary size-4 shrink-0" aria-hidden />
                              <div className="flex min-w-0 flex-col items-center gap-1 md:items-start">
                                 <MatchStartDate startsAt={featuredMatch.startsAt} />
                                 <CountdownLine parts={countdownParts} />
                              </div>
                              <span className="size-4 md:hidden" aria-hidden />
                           </div>
                        </>
                     )}
                  </div>
               </div>
            ) : (
               <div className="text-muted-foreground text-sm">{t('bswc.noMatch')}</div>
            )}

            <BswcActions promo={promo} />

            <div className="text-muted-foreground/45 absolute bottom-2 left-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 truncate text-center text-[10px] leading-none md:left-5 md:w-auto md:translate-x-0 md:text-left md:text-[11px] lg:left-6">
               {t('bswc.poweredBy')}
            </div>
         </div>
      </Card>
   );
}

export function BswcLiveNotice({ promo, previewLive = false }: { promo: HomeBswcPromo | null; previewLive?: boolean }) {
   const t = useTranslations('home');
   const pathname = useLocation({ select: (location) => location.pathname });
   const { featuredMatch, live } = getBswcPromoState(promo, previewLive);
   const liveMatchId = live && featuredMatch ? featuredMatch.id : null;
   const [open, setOpen] = useState(false);
   const [dismissedMatchId, setDismissedMatchId] = useState(() =>
      Result.unwrapOr(readStorageValue(BSWC_LIVE_NOTICE_DISMISSED_MATCH_STORAGE_KEY), null)
   );

   useEffect(() => {
      if (pathname === '/' || !liveMatchId) {
         setOpen(false);
         return;
      }

      setOpen(dismissedMatchId !== liveMatchId);
   }, [dismissedMatchId, liveMatchId, pathname]);

   if (pathname === '/' || !promo || !featuredMatch || !live || !open) return null;

   return (
      <Card
         variant="settings"
         className="bg-card/95 fixed right-3 bottom-[calc(var(--content-offset-bottom)+0.75rem)] z-[1600] w-[min(22rem,calc(100vw-1.5rem))] gap-0 overflow-hidden border-white/20 py-0 shadow-2xl shadow-black/20 backdrop-blur sm:right-4 sm:bottom-4"
      >
         <div className="relative aspect-video overflow-hidden">
            <BswcPromoImage promo={promo} linked={false} />
            <Button
               size="icon-xs"
               variant="ghost-icon"
               className="bg-background/65 text-foreground/80 hover:bg-background/80 absolute top-2 right-2 cursor-pointer backdrop-blur"
               aria-label={t('bswc.liveNotice.dismiss')}
               onClick={() => {
                  setOpen(false);
                  if (liveMatchId) {
                     setDismissedMatchId(liveMatchId);
                     writeStorageValue(BSWC_LIVE_NOTICE_DISMISSED_MATCH_STORAGE_KEY, liveMatchId);
                  }
               }}
            >
               <X />
            </Button>
         </div>

         <div className="flex flex-col items-center gap-3 p-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
               <div className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">{t('bswc.liveNow')}</div>
               <BswcMatchupLine match={featuredMatch} />
            </div>

            <Button
               asChild
               size="sm"
               variant="menu-filled"
               className="w-full cursor-pointer border-[#9146ff]/35 bg-[#9146ff]/10 text-[#bf94ff] hover:border-[#9146ff]/55 hover:bg-[#9146ff]/15 hover:text-[#d8c2ff]"
            >
               <a href={promo.twitchHref} target="_blank" rel="noreferrer">
                  <FaTwitch data-icon />
                  {t('bswc.liveNotice.watch')}
                  <ExternalLink data-icon />
               </a>
            </Button>
         </div>
      </Card>
   );
}

function BswcMedia({ promo, live, className }: { promo: HomeBswcPromo; live: boolean; className?: string }) {
   const t = useTranslations('home');
   const [parent, setParent] = useState<string | null>(null);

   useEffect(() => {
      setParent(window.location.hostname);
   }, []);

   const twitchSrc = parent ? twitchEmbedUrl(promo.twitchChannel, parent) : null;
   return (
      <div className={cn('relative aspect-video shrink-0 overflow-hidden md:aspect-auto md:min-h-64 md:basis-[42%]', className)}>
         {live && twitchSrc ? (
            <iframe
               src={twitchSrc}
               title={t('bswc.twitchEmbedTitle')}
               allow="autoplay; fullscreen; picture-in-picture"
               allowFullScreen
               className="absolute inset-0 h-full w-full border-0"
            />
         ) : (
            <BswcPromoImage promo={promo} />
         )}
      </div>
   );
}

function BswcPromoImage({ promo, linked = true }: { promo: HomeBswcPromo; linked?: boolean }) {
   const t = useTranslations('home');

   return (
      <>
         <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${BSWC_PROMO_IMAGE_URL}')` }} />
         {linked && <a href={promo.infoHref} target="_blank" rel="noreferrer" aria-label={t('bswc.infoAction')} className="absolute inset-0" />}
      </>
   );
}

function BswcMatchupLine({ match, className }: { match: HomeBswcMatch; className?: string }) {
   const t = useTranslations('home');

   return (
      <div className={cn('flex min-w-0 flex-wrap items-center justify-center gap-x-2.5 gap-y-2', className)}>
         <TeamMatchup team={match.team1} />
         <span className="text-muted-foreground text-xs font-semibold uppercase">{t('bswc.versus')}</span>
         <TeamMatchup team={match.team2} />
      </div>
   );
}

function TeamMatchup({ team }: { team: HomeBswcTeam }) {
   return (
      <div className="flex min-w-0 items-center gap-2">
         {team.imageUrl && (
            <FadeInImage src={team.imageUrl} alt={team.name} width={32} height={22} className="h-[22px] w-8 shrink-0 rounded-sm object-cover" />
         )}
         <span className="min-w-0 truncate text-sm font-bold sm:text-base">{team.name}</span>
      </div>
   );
}

function BswcActions({ promo }: { promo: HomeBswcPromo }) {
   const t = useTranslations('home');

   return (
      <div className="grid gap-2 pt-1 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
         <Button asChild size="sm" className="cursor-pointer">
            <a href={promo.infoHref} target="_blank" rel="noreferrer">
               <Trophy data-icon />
               {t('bswc.infoAction')}
               <ExternalLink data-icon />
            </a>
         </Button>
         <Button asChild size="sm" variant="menu-filled" className="cursor-pointer border-white/20">
            <a href={promo.scheduleHref} target="_blank" rel="noreferrer">
               <CalendarDays data-icon />
               {t('bswc.scheduleAction')}
               <ExternalLink data-icon />
            </a>
         </Button>
         <Button
            asChild
            size="sm"
            variant="menu-filled"
            className="cursor-pointer border-[#9146ff]/35 bg-[#9146ff]/10 text-[#bf94ff] hover:border-[#9146ff]/55 hover:bg-[#9146ff]/15 hover:text-[#d8c2ff]"
         >
            <a href={promo.twitchHref} target="_blank" rel="noreferrer">
               <FaTwitch data-icon />
               {t('bswc.twitchAction')}
               <ExternalLink data-icon />
            </a>
         </Button>
      </div>
   );
}

function getBswcPromoState(promo: HomeBswcPromo | null, previewLive: boolean) {
   if (!promo) return { featuredMatch: null, live: false };

   return {
      featuredMatch: promo.liveMatch ?? promo.nextMatch,
      live: !!promo.liveMatch || previewLive
   };
}

function MatchStartDate({ startsAt }: { startsAt: string }) {
   const locale = useLocale();
   const date = new Date(startsAt);
   const dateParts = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
   }).formatToParts(date);
   const timeText = new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
   }).format(date);
   const weekday = dateParts.find((part) => part.type === 'weekday')?.value;
   const day = dateParts.find((part) => part.type === 'day')?.value;
   const month = dateParts.find((part) => part.type === 'month')?.value;

   return (
      <span className="min-w-0 truncate text-xs font-semibold" suppressHydrationWarning>
         {weekday} {day} {month}, {timeText}
      </span>
   );
}

function CountdownLine({ parts }: { parts: CountdownPart[] }) {
   const t = useTranslations('home');
   const displayParts = parts[0].value === 0 ? parts.slice(1) : parts;

   return (
      <div className="text-primary flex flex-wrap items-baseline gap-x-1.5 gap-y-1 font-mono text-xs font-semibold" suppressHydrationWarning>
         <NumberFlowGroup>
            <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
               {displayParts.map((part) => (
                  <span key={part.key} className="inline-flex items-baseline gap-0.5">
                     <NumberFlow
                        value={part.value}
                        trend={-1}
                        format={{ minimumIntegerDigits: 2 }}
                        digits={part.key === 'minutes' || part.key === 'seconds' ? { 1: { max: 5 } } : undefined}
                        className="tabular-nums"
                     />
                     <span className="font-sans">{t(`bswc.countdown.${part.key}`)}</span>
                  </span>
               ))}
            </span>
         </NumberFlowGroup>
      </div>
   );
}

function getCountdownParts(startsAt: string | undefined, now: number): CountdownPart[] {
   const startsAtMs = startsAt ? Date.parse(startsAt) : 0;
   const remaining = Math.max(0, Number.isFinite(startsAtMs) ? startsAtMs - now : 0);
   const days = Math.floor(remaining / DAY_MS);
   const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
   const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
   const seconds = Math.floor((remaining % MINUTE_MS) / SECOND_MS);

   return [
      { key: 'days', value: days },
      { key: 'hours', value: hours },
      { key: 'minutes', value: minutes },
      { key: 'seconds', value: seconds }
   ];
}

function twitchEmbedUrl(channel: string, parent: string) {
   const url = new URL('https://player.twitch.tv/');
   url.searchParams.set('channel', channel);
   url.searchParams.set('parent', parent);
   url.searchParams.set('muted', 'true');
   return url.toString();
}
