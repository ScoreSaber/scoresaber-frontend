'use client';

import { useEffect, useState, type CSSProperties } from 'react';

import { Loader2 } from 'lucide-react';
import { FaUserCheck, FaUserFriends, FaUserPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { followPlayer, unfollowPlayer } from '@/modules/player/actions/user/member';
import { cn } from '@/shared/format/helpers';

type FollowState = 'none' | 'following' | 'mutual';

interface PlayerFollowButtonProps {
   playerId: string;
   compact?: boolean;
}

export function PlayerFollowButton({ playerId, compact }: PlayerFollowButtonProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const [hovered, setHovered] = useState(false);
   const action = useActionMutation();

   const resolved = resolveFollowState(user, playerId);
   const [state, setState] = useState<FollowState>(resolved.state);
   const [isPlatformFriend, setIsPlatformFriend] = useState(resolved.platformFriend);

   // re-sync after router.refresh()
   useEffect(() => {
      const fresh = resolveFollowState(user, playerId);
      setState(fresh.state);
      setIsPlatformFriend(fresh.platformFriend);
   }, [user, playerId]);

   // don't render on own profile or when logged out
   if (!user || user.id === playerId) return null;

   const pending = action.isPending;
   const isFollowing = state === 'following' || state === 'mutual';
   const showUnfollow = isFollowing && hovered && !pending && !isPlatformFriend;

   function handleClick() {
      if (isPlatformFriend) return;

      const mutate = isFollowing ? () => unfollowPlayer(playerId) : () => followPlayer(playerId);
      const nextState = isFollowing ? 'none' : 'following';
      const errorMessage = isFollowing ? t('player.failedToUnfollow') : t('player.failedToFollow');

      action.mutate(mutate, {
         onSuccess: () => setState(nextState),
         onError: () => toast.error(errorMessage)
      });
   }

   const label = showUnfollow
      ? t('player.unfollow')
      : state === 'mutual'
        ? t('player.mutual')
        : state === 'following'
          ? t('player.followingStatus')
          : t('player.follow');
   const compactIconClass = compact ? 'size-2.5' : undefined;
   const accentSolidStyle: CSSProperties = {
      borderColor: 'var(--profile-accent, var(--primary))',
      backgroundColor: 'var(--profile-accent, var(--primary))',
      color: 'var(--profile-accent-active-foreground, var(--profile-accent-foreground, var(--primary-foreground)))'
   };
   const accentSubtleStyle: CSSProperties = {
      borderColor: 'color-mix(in srgb, var(--profile-accent, var(--primary)) 35%, transparent)',
      backgroundColor: 'color-mix(in srgb, var(--profile-accent, var(--primary)) 12%, transparent)',
      color: 'var(--profile-accent, var(--primary))'
   };
   const accentStyle = showUnfollow ? undefined : isFollowing ? accentSubtleStyle : accentSolidStyle;

   const icon = pending ? (
      <Loader2 className={cn('animate-spin', compactIconClass)} />
   ) : showUnfollow ? (
      <FaUserPlus className={cn('rotate-45', compactIconClass)} />
   ) : state === 'mutual' ? (
      <FaUserFriends className={compactIconClass} />
   ) : state === 'following' ? (
      <FaUserCheck className={compactIconClass} />
   ) : (
      <FaUserPlus className={compactIconClass} />
   );

   // platform friend -- disabled with tooltip
   if (isPlatformFriend) {
      return (
         <Tooltip>
            <TooltipTrigger asChild>
               <Button
                  variant={compact ? 'outline' : 'secondary'}
                  size={compact ? 'icon' : 'xs'}
                  className={cn('cursor-not-allowed opacity-70', compact && 'rounded-full')}
                  style={accentSubtleStyle}
                  disabled
               >
                  {state === 'mutual' ? <FaUserFriends className={compactIconClass} /> : <FaUserCheck className={compactIconClass} />}
                  {!compact && (state === 'mutual' ? t('player.mutual') : t('player.followingStatus'))}
               </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-center">
               <p>{t('player.platformFriendsTooltip')}</p>
            </TooltipContent>
         </Tooltip>
      );
   }

   const button = (
      <Button
         variant={compact ? 'outline' : state === 'none' ? 'default' : 'secondary'}
         size={compact ? 'icon' : 'xs'}
         className={cn(
            'cursor-pointer transition-[background-color,color,border-color]',
            compact && 'rounded-full',
            showUnfollow && 'border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15'
         )}
         style={accentStyle}
         disabled={pending}
         onClick={handleClick}
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
         aria-label={compact ? label : undefined}
      >
         {icon}
         {!compact && label}
      </Button>
   );

   // compact mode gets a tooltip since there's no text label
   if (compact) {
      return (
         <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
               <p>{label}</p>
            </TooltipContent>
         </Tooltip>
      );
   }

   return button;
}

function resolveFollowState(user: ReturnType<typeof useAuth>['user'], playerId: string): { state: FollowState; platformFriend: boolean } {
   if (!user?.relationships) return { state: 'none', platformFriend: false };

   const mutual = user.relationships.mutuals?.find((m) => m.id === playerId);
   if (mutual) return { state: 'mutual', platformFriend: mutual.relation === 'platform-friend' };

   const following = user.relationships.following?.find((f) => f.id === playerId);
   if (following) return { state: 'following', platformFriend: following.relation === 'platform-friend' };

   return { state: 'none', platformFriend: false };
}
