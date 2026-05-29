'use client';

import type { ReactNode } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import {
   FaBan,
   FaBullseye,
   FaCalendarAlt,
   FaExternalLinkAlt,
   FaEye,
   FaGamepad,
   FaGlobe,
   FaHashtag,
   FaMoon,
   FaShieldAlt,
   FaStar,
   FaTrophy
} from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { PlayerFollowButton } from '@/modules/player/operations/member/player-follow-button';
import { buildPlayerSummary } from '@/modules/player/player-summary';
import { PlayerAliases } from '@/modules/player/profile/player-aliases';
import { PlayerBadges } from '@/modules/player/profile/player-badges';
import { PlayerAvatar } from '@/modules/player/shared/player-avatar';
import { PlayerLink } from '@/modules/player/shared/player-link';
import type { PlayerAliasControllerGetAliasesItem, PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';
import { CountryImage } from '@/shared/components/country-image';
import { DeviceDisplay } from '@/shared/components/device-display';
import { Stat } from '@/shared/components/stat';
import { Time } from '@/shared/components/time';
import { parseCountryRegionParam } from '@/shared/country-region';
import { cn, formatAccuracy, formatNumber, formatPP, rankToPage } from '@/shared/format/helpers';
import { normalizePlayerRoleText } from '@/shared/format/styling';

const rankingsRoute = getRouteApi('/rankings');

const ppBadgeClass =
   'border-primary/25 bg-primary/15 text-primary-foreground dark:text-primary rounded-full border px-2.5 py-0.5 text-sm font-semibold tabular-nums';
const ppUnitClass = 'text-primary-foreground/70 dark:text-primary/70 text-[10px] font-medium uppercase';
const rankPillClass =
   'inline-flex items-center gap-2 rounded-md border-l-2 border-primary/60 bg-primary/5 px-2.5 py-1 transition-colors hover:bg-primary/10';

export function PlayerProfileHeader({ player, aliases, actions, children }: PlayerProfileHeaderProps) {
   const t = useTranslations();
   const { stats } = player;
   const playerSummary = buildPlayerSummary(player, 'text');
   const isActive = !playerSummary.isInactive && !playerSummary.isBanned;

   return (
      <div className="relative z-10">
         <div className="relative flex items-start">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
               <div className="flex shrink-0 flex-col items-center gap-2">
                  <div className="relative">
                     <PlayerAvatar
                        className={cn(
                           'h-24 w-24 rounded-full shadow-lg ring-2',
                           player.banned ? 'ring-destructive/40 grayscale' : player.inactive ? 'opacity-60 grayscale' : ''
                        )}
                        width={96}
                        height={96}
                        alt={player.name}
                        src={player.avatar}
                        playerId={player.id}
                        priority
                     />
                     {player.banned && (
                        <div className="bg-destructive/20 absolute inset-0 flex items-center justify-center rounded-full">
                           <FaBan className="text-destructive/70 size-10" />
                        </div>
                     )}
                  </div>
                  <div className="hidden sm:block">
                     <PlayerFollowButton playerId={player.id} />
                  </div>
                  {!player.banned && (
                     <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
                        <span>
                           <span className="text-foreground font-semibold tabular-nums">{formatNumber(player.followers)}</span>{' '}
                           {t('player.followers')}
                        </span>
                        <span>
                           <span className="text-foreground font-semibold tabular-nums">{formatNumber(player.following)}</span>{' '}
                           {t('player.following')}
                        </span>
                     </div>
                  )}
               </div>

               <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:items-start">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                     <div className="flex min-w-0 items-center gap-1.5">
                        <CountryImage country={player.country} size={18} />
                        <h1 className="min-w-0">
                           <PlayerLink player={player} variant="inline" className="truncate text-xl font-bold" />
                        </h1>
                        {playerSummary.steamHref && (
                           <a
                              href={playerSummary.steamHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t('player.viewSteamProfile')}
                              className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                           >
                              <FaExternalLinkAlt className="size-2.5" aria-hidden="true" />
                           </a>
                        )}
                        {aliases && <PlayerAliases aliases={aliases} playerId={player.id} />}
                     </div>

                     {isActive && (
                        <StatusBadge tooltip={t('common.performancePoints')} className={ppBadgeClass}>
                           {formatPP(stats.totalPP)}
                           <span className={ppUnitClass}>pp</span>
                        </StatusBadge>
                     )}

                     {playerSummary.isInactive && !playerSummary.isBanned && (
                        <StatusBadge
                           tooltip={t('player.inactiveTooltip')}
                           className="border-border/40 bg-muted/40 text-muted-foreground rounded-md border px-2 py-0.5 text-xs font-medium"
                        >
                           <FaMoon className="size-2.5" />
                           {t('player.inactive')}
                        </StatusBadge>
                     )}

                     {playerSummary.isBanned && (
                        <StatusBadge
                           tooltip={t('player.bannedTooltip')}
                           className="border-destructive/30 bg-destructive/15 text-destructive rounded-md border px-2 py-0.5 text-xs font-semibold"
                        >
                           <FaBan className="size-2.5" />
                           {t('player.banned')}
                        </StatusBadge>
                     )}
                  </div>

                  {/* rank pills + device */}
                  {isActive && (
                     <div className="flex flex-wrap items-stretch justify-center gap-2 sm:justify-start">
                        {[
                           {
                              search: { page: rankToPage(stats.rank, 50), highlight: player.id },
                              icon: <FaGlobe className="text-muted-foreground size-3" />,
                              value: stats.rank,
                              label: t('player.global')
                           },
                           {
                              search: {
                                 page: rankToPage(stats.countryRank, 50),
                                 countries: parseCountryRegionParam(player.country),
                                 highlight: player.id
                              },
                              icon: <CountryImage country={player.country} size={16} />,
                              value: stats.countryRank,
                              label: t('player.countryRank')
                           }
                        ].map(({ search, icon, value, label }) => (
                           <rankingsRoute.Link key={label} search={search} className={rankPillClass}>
                              {icon}
                              <div>
                                 <div className="text-primary-foreground dark:text-primary text-sm font-bold tabular-nums">
                                    #{formatNumber(value)}
                                 </div>
                                 <div className="text-muted-foreground text-[9px] tracking-wider uppercase">{label}</div>
                              </div>
                           </rankingsRoute.Link>
                        ))}
                        {stats.device?.hmd && (
                           <DeviceDisplay
                              hmd={stats.device.hmd}
                              controllerLeft={stats.device.controllerLeft}
                              controllerRight={stats.device.controllerRight}
                              variant="stacked"
                              size="md"
                           />
                        )}
                     </div>
                  )}

                  {/* stats */}
                  {!player.banned && (
                     <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                           <Stat
                              icon={FaTrophy}
                              label={t('player.rankedPlays')}
                              labelClassName="text-primary-foreground/70 dark:text-primary/70"
                              valueClassName="text-primary-foreground dark:text-primary tabular-nums"
                           >
                              {formatNumber(stats.totalPlayedRankedLeaderboards)}
                           </Stat>
                           <Stat
                              icon={FaStar}
                              label={t('player.rankedScore')}
                              labelClassName="text-primary-foreground/70 dark:text-primary/70"
                              valueClassName="text-primary-foreground dark:text-primary tabular-nums"
                           >
                              {formatNumber(Number(stats.totalRankedScore))}
                           </Stat>
                           <Stat
                              icon={FaBullseye}
                              label={t('player.rankedAcc')}
                              labelClassName="text-primary-foreground/70 dark:text-primary/70"
                              valueClassName="text-primary-foreground dark:text-primary tabular-nums"
                           >
                              {formatAccuracy(stats.averageAccuracy)}
                           </Stat>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                           <Stat icon={FaGamepad} label={t('common.totalPlays')} valueClassName="tabular-nums">
                              {formatNumber(stats.totalPlayedLeaderboards)}
                           </Stat>
                           <Stat icon={FaHashtag} label={t('player.totalScore')} valueClassName="tabular-nums">
                              {formatNumber(Number(stats.totalScore))}
                           </Stat>
                           <Stat icon={FaCalendarAlt} label={t('player.joined')}>
                              <Time date={player.createdAt} dateOnly />
                           </Stat>
                           <Stat icon={FaEye} label={t('player.replayViews')} valueClassName="tabular-nums">
                              {formatNumber(stats.totalReplayViews)}
                           </Stat>
                           {playerSummary.hasSpecialRole && (
                              <Stat icon={FaShieldAlt} label={t('player.role')}>
                                 {player.role ? normalizePlayerRoleText(player.role) : playerSummary.roleTitle!}
                              </Stat>
                           )}
                        </div>
                     </div>
                  )}

                  {!player.banned && player.badges && <PlayerBadges badges={player.badges} />}
               </div>
            </div>

            <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 sm:relative sm:top-auto sm:right-auto sm:ml-3 sm:shrink-0">
               <div className="sm:hidden">
                  <PlayerFollowButton playerId={player.id} compact />
               </div>
               {actions}
            </div>
         </div>

         {children}
      </div>
   );
}

function StatusBadge({ tooltip, className, children }: { tooltip: string; className: string; children: ReactNode }) {
   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <span className={cn('inline-flex cursor-help items-center gap-1', className)}>{children}</span>
         </TooltipTrigger>
         <TooltipContent>
            <p>{tooltip}</p>
         </TooltipContent>
      </Tooltip>
   );
}

interface PlayerProfileHeaderProps {
   player: PlayerControllerGetPlayerResponse;
   aliases?: PlayerAliasControllerGetAliasesItem[];
   actions?: ReactNode;
   children?: ReactNode;
}
