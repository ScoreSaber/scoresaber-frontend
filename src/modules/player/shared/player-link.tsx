'use client';

import { getRouteApi } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { PlayerAvatar } from './player-avatar';
import { PlayerHoverCard } from './player-hover-card';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { buildPlayerSummary } from '@/modules/player/player-summary';
import { CountryImage } from '@/shared/components/country-image';
import { cn } from '@/shared/format/helpers';
import type { PlayerRoleSource } from '@/shared/format/styling';

const playerRoute = getRouteApi('/u/$playerId');

type PlayerLinkProps = {
   player: PlayerRoleSource;
   outLink?: boolean;
   className?: string;
   withPFP?: boolean;
   variant?: 'link' | 'inline';
   isInactive?: boolean;
};

export function PlayerLink({ player, outLink, className, withPFP, variant = 'link', isInactive }: PlayerLinkProps) {
   const t = useTranslations();
   const playerSummary = buildPlayerSummary(player);

   if (variant === 'inline') {
      return <PlayerName player={player} className={className} playerStyle={playerSummary.roleClassName} />;
   }

   const link = outLink ? (
      <a
         className="group/link text-foreground flex items-center overflow-hidden font-semibold"
         target="_blank"
         href={playerSummary.steamHref ?? ''}
         rel="external noopener noreferrer"
      >
         <CountryImage country={player.country} className="shrink-0" />
         <PlayerName
            player={player}
            className={cn('ml-2 truncate', isInactive && 'opacity-50', className)}
            playerStyle={playerSummary.roleClassName}
         />
      </a>
   ) : (
      <playerRoute.Link className="group/link text-foreground flex items-center overflow-hidden font-semibold" params={{ playerId: player.id }}>
         <CountryImage country={player.country} className="shrink-0" />
         <PlayerHoverCard playerId={player.id}>
            <PlayerName
               player={player}
               className={cn('ml-2 truncate', isInactive && 'opacity-50', className)}
               playerStyle={playerSummary.roleClassName}
            />
         </PlayerHoverCard>
      </playerRoute.Link>
   );

   return (
      <div className="flex min-w-0 items-center">
         {withPFP && (
            <PlayerAvatar
               src={player.avatar}
               alt={player.name}
               width={32}
               height={32}
               className={cn('shrink-0 rounded-full', isInactive && 'opacity-50 grayscale')}
            />
         )}
         <div className={cn('flex min-w-0 overflow-hidden', withPFP && 'ml-2')}>{link}</div>
         {isInactive && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <span className="border-border/40 bg-muted/40 text-muted-foreground ml-2 shrink-0 cursor-default rounded border px-1.5 py-0.5 text-[10px] font-medium">
                     {t('player.inactive')}
                  </span>
               </TooltipTrigger>
               <TooltipContent>
                  <p>{t('player.inactiveTooltip')}</p>
               </TooltipContent>
            </Tooltip>
         )}
      </div>
   );
}

function PlayerName({ player, className, playerStyle }: { player: PlayerRoleSource; className?: string; playerStyle: string }) {
   return <span className={cn(playerStyle, className)}>{player.name}</span>;
}
