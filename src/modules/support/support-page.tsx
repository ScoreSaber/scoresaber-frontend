'use client';

import { useState } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import {
   AtSign,
   Award,
   BadgeCheck,
   Crown,
   Film,
   Image as ImageIcon,
   Info,
   LayoutDashboard,
   type LucideIcon,
   Paintbrush,
   Palette,
   PenLine,
   Pin,
   Server,
   ShieldCheck,
   Star,
   Swords
} from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { BeatSaberPageBackground } from '@/modules/home/beat-saber-background';
import { Icons } from '@/shared/components/icons';
import { Image } from '@/shared/components/image';
import { cn } from '@/shared/format/helpers';

const PATREON_URL = 'https://patreon.com/scoresaber/membership';

const SUPPORTER_ACCENT = 'var(--role-supporter)';
const PP_FARMER_ACCENT = 'var(--score-pp)';

const routeApi = getRouteApi('/support');
const connectionsRoute = getRouteApi('/settings/connections');

type Perk = { Icon: LucideIcon; title: string; description?: string };

export function SupportPage() {
   return (
      <div className="dark bg-background text-foreground relative flex-1 overflow-hidden max-lg:mb-[calc(var(--content-offset-bottom)*-1)] max-lg:pb-(--content-offset-bottom)">
         <BeatSaberPageBackground />
         <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-20 px-4 pt-16 pb-24 sm:px-6 lg:px-10">
            <SupportHero />
            <SupportReasons />
            <SupportTiers />
            <SupportCta showConnect={false} />
         </main>
      </div>
   );
}

function SupportHero() {
   const t = useTranslations('support');

   return (
      <section className="flex flex-col items-center gap-6 pt-6 text-center">
         <Image src="/scoresaber.svg" alt={t('logoAlt')} width={76} height={76} priority className="drop-shadow-[0_14px_36px_hsl(0_0%_0%/0.6)]" />
         <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">{t('title')}</h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">{t('subtitle')}</p>
         </div>
         <SupportCta />
      </section>
   );
}

function SupportCta({ showConnect = true }: { showConnect?: boolean }) {
   const t = useTranslations('support');

   return (
      <div className="flex flex-col items-center gap-3">
         <Button asChild size="lg" className="cursor-pointer">
            <a href={PATREON_URL} target="_blank" rel="noreferrer">
               <Icons.patreon className="size-4 fill-current" aria-hidden />
               {t('supportCta')}
            </a>
         </Button>
         {showConnect ? (
            <p className="text-muted-foreground text-sm">
               {t('connect.text')}{' '}
               <connectionsRoute.Link search={{}} className="text-primary cursor-pointer font-medium underline-offset-4 hover:underline">
                  {t('connect.link')}
               </connectionsRoute.Link>
            </p>
         ) : null}
      </div>
   );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
   return (
      <div className="flex flex-col gap-2 text-center">
         <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
         {subtitle ? <p className="text-muted-foreground mx-auto max-w-2xl text-sm text-pretty sm:text-base">{subtitle}</p> : null}
      </div>
   );
}

function SupportReasons() {
   const t = useTranslations('support');
   const top: Perk[] = [
      { Icon: Server, title: t('why.servers.title'), description: t('why.servers.description') },
      { Icon: Film, title: t('why.replays.title'), description: t('why.replays.description') }
   ];
   const evolution: Perk = { Icon: Swords, title: t('why.platform.title'), description: t('why.platform.description') };

   return (
      <section className="flex flex-col gap-8">
         <SectionHeading title={t('why.title')} />
         <div className="flex flex-col items-center gap-4">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
               {top.map((reason) => (
                  <ReasonCard key={reason.title} reason={reason} />
               ))}
            </div>
            <ReasonCard reason={evolution} className="w-full sm:w-[calc(50%-0.5rem)]" />
         </div>
      </section>
   );
}

function ReasonCard({ reason, className }: { reason: Perk; className?: string }) {
   const { Icon } = reason;

   return (
      <Card variant="settings" className={cn('flex flex-row items-center gap-4 border-white/10 p-5', className)}>
         <span className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-5" aria-hidden />
         </span>
         <div className="flex flex-col gap-1">
            <h3 className="font-semibold tracking-tight">{reason.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed text-pretty">{reason.description}</p>
         </div>
      </Card>
   );
}

function SupportTiers() {
   const t = useTranslations('support');
   const { formatted, ppFarmerFormatted } = routeApi.useLoaderData();
   const supporterPrice = t('tiers.supporter.price', { price: formatted });
   const ppFarmerPrice = t('tiers.ppFarmer.price', { price: ppFarmerFormatted });

   const supporterPerks: Perk[] = [
      { Icon: PenLine, title: t('perks.bio.title') },
      { Icon: AtSign, title: t('perks.vanity.title'), description: t('perks.vanity.description') },
      { Icon: Paintbrush, title: t('perks.nameColor.title'), description: t('perks.nameColor.description') },
      { Icon: BadgeCheck, title: t('perks.supporterRole.title'), description: t('perks.supporterRole.description') },
      { Icon: ShieldCheck, title: t('perks.adFree.title'), description: t('perks.adFree.description') },
      { Icon: Film, title: t('perks.replays5k.title'), description: t('perks.replays5k.description') }
   ];

   const ppFarmerPerks: Perk[] = [
      { Icon: Pin, title: t('perks.pinned.title'), description: t('perks.pinned.description') },
      { Icon: LayoutDashboard, title: t('perks.customization.title'), description: t('perks.customization.description') },
      { Icon: Palette, title: t('perks.accent.title') },
      { Icon: Award, title: t('perks.ppFarmerBadge.title'), description: t('perks.ppFarmerBadge.description') },
      { Icon: ImageIcon, title: t('perks.background.title') },
      { Icon: Film, title: t('perks.replays20k.title'), description: t('perks.replays20k.description') }
   ];

   return (
      <section className="flex flex-col gap-8">
         <SectionHeading title={t('tiers.title')} subtitle={t('tiers.subtitle')} />
         <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-0">
            <TierColumn
               name={t('tiers.supporter.name')}
               subtitle={supporterPrice}
               TierIcon={Star}
               accent={SUPPORTER_ACCENT}
               perks={supporterPerks}
               align="end"
               className="md:flex-1 md:pr-4"
            />
            <Separator orientation="vertical" variant="gradient" className="hidden self-stretch md:block" />
            <TierColumn
               name={t('tiers.ppFarmer.name')}
               subtitle={ppFarmerPrice}
               TierIcon={Crown}
               tierIconClassName="-translate-y-px"
               accent={PP_FARMER_ACCENT}
               perks={ppFarmerPerks}
               inheritsLabel={t('tiers.everythingIn')}
               className="md:flex-1 md:pl-4"
            />
         </div>
         <p className="text-muted-foreground text-center text-sm">{t('tiers.moreSoon')}</p>
      </section>
   );
}

type TierColumnProps = {
   name: string;
   TierIcon: LucideIcon;
   tierIconClassName?: string;
   accent: string;
   perks: Perk[];
   subtitle?: string;
   inheritsLabel?: string;
   align?: 'start' | 'end';
   className?: string;
};

function TierColumn({ name, TierIcon, tierIconClassName, accent, perks, subtitle, inheritsLabel, align = 'start', className }: TierColumnProps) {
   return (
      <div className={className}>
         <div
            className={cn(
               'flex flex-col items-center gap-5 text-center',
               align === 'end' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'
            )}
         >
            <div className={cn('flex min-w-0 flex-col items-center justify-center gap-3', align === 'end' ? 'md:flex-row-reverse' : 'md:flex-row')}>
               <TierIcon className={cn('size-6', tierIconClassName)} style={{ color: accent }} aria-hidden />
               <div className={cn('flex min-w-0 flex-col items-center gap-0.5', align === 'end' ? 'md:items-end' : 'md:items-start')}>
                  <h3
                     className={cn(
                        'flex min-w-0 flex-col items-center justify-center gap-x-2 gap-y-1 text-xl font-semibold tracking-tight md:flex-row md:items-baseline',
                        align === 'end' ? 'md:justify-end' : 'md:justify-start'
                     )}
                  >
                     <span>{name}</span>
                     {inheritsLabel ? <span className="text-muted-foreground/70 text-[0.6875rem] font-normal">{inheritsLabel}</span> : null}
                  </h3>
                  {subtitle ? <p className="text-muted-foreground/70 text-xs leading-none font-medium">{subtitle}</p> : null}
               </div>
            </div>
            <ul className={cn('flex w-full flex-col items-center gap-4', align === 'end' ? 'md:items-end' : 'md:items-start')}>
               {perks.map((perk) => (
                  <PerkRow key={perk.title} perk={perk} accent={accent} align={align} />
               ))}
            </ul>
         </div>
      </div>
   );
}

function PerkRow({ perk, accent, align }: { perk: Perk; accent: string; align: 'start' | 'end' }) {
   const { Icon } = perk;
   const [descriptionOpen, setDescriptionOpen] = useState(false);

   return (
      <li
         className={cn(
            'flex items-start justify-center gap-3 text-center',
            align === 'end' ? 'md:flex-row-reverse md:justify-end md:text-right' : 'md:justify-start md:text-left'
         )}
      >
         <span className="flex size-6 shrink-0 items-start justify-center pt-0.5">
            <Icon className="size-4" style={{ color: accent }} aria-hidden />
         </span>
         <div className={cn('flex min-w-0 flex-col items-center gap-0.5', align === 'end' ? 'md:items-end' : 'md:items-start')}>
            <span
               className={cn(
                  'flex min-w-0 items-center justify-center gap-1.5 text-sm leading-snug font-medium',
                  align === 'end' ? 'md:flex-row-reverse md:justify-end' : 'md:justify-start'
               )}
            >
               <span>{perk.title}</span>
               {perk.description ? (
                  <Tooltip open={descriptionOpen} onOpenChange={setDescriptionOpen}>
                     <TooltipTrigger asChild>
                        <button
                           type="button"
                           className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-4 cursor-default items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
                           aria-label={perk.description}
                           onClick={() => setDescriptionOpen((current) => !current)}
                        >
                           <Info className="size-3.5" aria-hidden />
                        </button>
                     </TooltipTrigger>
                     <TooltipContent side="bottom" sideOffset={6} className="max-w-64 text-center">
                        <p>{perk.description}</p>
                     </TooltipContent>
                  </Tooltip>
               ) : null}
            </span>
         </div>
      </li>
   );
}
