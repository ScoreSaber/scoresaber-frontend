'use client';

import { useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuth } from '@/modules/auth';
import { PlayerFollowButton } from '@/modules/player/operations/member/player-follow-button';
import { versionedImageUrl } from '@/modules/player/shared/player-avatar';
import { PlayerLink } from '@/modules/player/shared/player-link';
import { api } from '@/shared/api/ApiInstance';
import type {
   PlayerControllerGetPlayerResponse,
   PlayerRelationshipControllerGetRelationshipsResponse,
   PlayerRelationshipControllerGetRelationshipsType
} from '@/shared/api/generated/ApiParams';
import { Icons } from '@/shared/components/icons';
import { formatNumber } from '@/shared/format/helpers';
import { queryApiData } from '@/shared/result/api';
import { toInt64PathParam } from '@/shared/url-state/params';

const PAGE_SIZE = 20;

export function PlayerRelationships({ player }: { player: PlayerControllerGetPlayerResponse }) {
   const t = useTranslations('player');
   const { user } = useAuth();
   const [open, setOpen] = useState(false);
   const [type, setType] = useState<PlayerRelationshipControllerGetRelationshipsType>('followers');
   const isOwner = user?.id === player.id;

   const relationships = useInfiniteQuery({
      queryKey: ['playerRelationships', player.id, type],
      queryFn: ({ pageParam, signal }) =>
         queryApiData(
            api.player.playerRelationshipControllerGetRelationships(
               {
                  id: toInt64PathParam(player.id),
                  type,
                  page: pageParam,
                  limit: PAGE_SIZE
               },
               { signal }
            )
         ),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => (lastPage.metadata.page < lastPage.metadata.totalPages ? lastPage.metadata.page + 1 : undefined),
      enabled: open && (type !== 'platform-friends' || isOwner),
      staleTime: 30 * 1000
   });

   function showRelationships(nextType: PlayerRelationshipControllerGetRelationshipsType) {
      setType(nextType);
      setOpen(true);
   }

   function selectType(value: string) {
      setType(value === 'following' || value === 'platform-friends' ? value : 'followers');
   }

   const relationshipItems = relationships.data?.pages.flatMap((page) => page.data) ?? [];
   const websiteFollowerCount = player.followers - player.platformFriends;
   const websiteFollowingCount = player.following - player.platformFriends;

   return (
      <>
         <div className="flex items-start justify-center gap-1 sm:justify-start">
            <Button
               type="button"
               variant="ghost"
               size="xs"
               className="text-muted-foreground hover:text-foreground h-auto flex-col px-1 py-0.5 text-[11px] font-normal hover:bg-transparent dark:hover:bg-transparent"
               onClick={() => showRelationships('followers')}
            >
               <span className="flex items-center gap-1">
                  <span className="text-foreground font-semibold tabular-nums">{formatNumber(player.followers)}</span>
                  {t('followers')}
               </span>
               <RecentRelationshipAvatars players={player.recentFollowers} />
            </Button>
            <Button
               type="button"
               variant="ghost"
               size="xs"
               className="text-muted-foreground hover:text-foreground h-auto flex-col px-1 py-0.5 text-[11px] font-normal hover:bg-transparent dark:hover:bg-transparent"
               onClick={() => showRelationships('following')}
            >
               <span className="flex items-center gap-1">
                  <span className="text-foreground font-semibold tabular-nums">{formatNumber(player.following)}</span>
                  {t('following')}
               </span>
               <RecentRelationshipAvatars players={player.recentFollowing} />
            </Button>
         </div>

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="gap-0 overflow-hidden p-0 max-sm:grid-rows-[auto_minmax(0,1fr)] sm:max-w-lg" aria-describedby={undefined}>
               <DialogHeader className="p-6 pb-3">
                  <DialogTitle>{t('relationshipsTitle', { name: player.name })}</DialogTitle>
               </DialogHeader>
               <Tabs value={type} onValueChange={selectType} className="min-h-0 min-w-0 overflow-hidden max-sm:gap-0">
                  <TabsList variant="line" className="w-full rounded-none px-6">
                     <TabsTrigger value="followers">
                        {t('followers')}
                        <span className="tabular-nums">{formatNumber(websiteFollowerCount)}</span>
                     </TabsTrigger>
                     <TabsTrigger value="following">
                        {t('following')}
                        <span className="tabular-nums">{formatNumber(websiteFollowingCount)}</span>
                     </TabsTrigger>
                     <TabsTrigger value="platform-friends" disabled={!isOwner}>
                        {t('platformFriends')}
                        <span className="tabular-nums">{formatNumber(player.platformFriends)}</span>
                     </TabsTrigger>
                  </TabsList>
                  <Separator />
                  <RelationshipList
                     data={relationshipItems}
                     type={type}
                     isOwner={isOwner}
                     isPending={relationships.isPending}
                     isError={relationships.isError}
                     isFetchingNextPage={relationships.isFetchingNextPage}
                     hasNextPage={relationships.hasNextPage}
                     onLoadMore={() => void relationships.fetchNextPage()}
                  />
               </Tabs>
            </DialogContent>
         </Dialog>
      </>
   );
}

function RecentRelationshipAvatars({ players }: { players: PlayerControllerGetPlayerResponse['recentFollowers'] }) {
   if (players.length === 0) return null;

   const fadeStyle =
      players.length === 4
         ? {
              WebkitMaskImage: 'linear-gradient(to right, black 0%, black 45%, transparent 100%)',
              maskImage: 'linear-gradient(to right, black 0%, black 45%, transparent 100%)'
           }
         : undefined;

   return (
      <div aria-hidden="true" className="flex" style={fadeStyle}>
         {players.map((relationshipPlayer) => (
            <Avatar key={relationshipPlayer.id} className="-ml-2 size-5 first:ml-0" title={relationshipPlayer.name}>
               <AvatarImage src={versionedImageUrl(relationshipPlayer.avatar, relationshipPlayer.avatarVersion)} alt="" />
               <AvatarFallback className="text-[9px]">{relationshipPlayer.name.slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
         ))}
      </div>
   );
}

function RelationshipList({
   data,
   type,
   isOwner,
   isPending,
   isError,
   isFetchingNextPage,
   hasNextPage,
   onLoadMore
}: {
   data: PlayerRelationshipControllerGetRelationshipsResponse['data'];
   type: PlayerRelationshipControllerGetRelationshipsType;
   isOwner: boolean;
   isPending: boolean;
   isError: boolean;
   isFetchingNextPage: boolean;
   hasNextPage: boolean;
   onLoadMore: () => void;
}) {
   const t = useTranslations('player');

   return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden sm:h-[min(60dvh,28rem)] sm:flex-none">
         <div
            className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
            onScroll={(event) => {
               const list = event.currentTarget;

               if (hasNextPage && !isFetchingNextPage && list.scrollHeight - list.scrollTop - list.clientHeight < 96) {
                  onLoadMore();
               }
            }}
         >
            {isPending ? (
               <div className="flex h-full items-center justify-center">
                  <Icons.spinner className="text-muted-foreground size-6 animate-spin" />
               </div>
            ) : isError ? (
               <Empty className="border-0 py-12">
                  <EmptyHeader>
                     <EmptyMedia variant="icon">
                        <Users />
                     </EmptyMedia>
                     <EmptyTitle>{t('relationshipsLoadFailed')}</EmptyTitle>
                  </EmptyHeader>
               </Empty>
            ) : data.length ? (
               data.map((relationship, index) => (
                  <div key={relationship.player.id} className="min-w-0">
                     {index > 0 && <Separator />}
                     <div className="flex min-w-0 items-center gap-3 overflow-hidden px-6 py-3">
                        <div className="min-w-0 flex-1">
                           <PlayerLink player={relationship.player} withPFP showHoverCard={false} />
                        </div>
                        <PlayerFollowButton playerId={relationship.player.id} followsViewer={isOwner && type === 'followers'} />
                     </div>
                  </div>
               ))
            ) : (
               <Empty className="border-0 py-12">
                  <EmptyHeader>
                     <EmptyMedia variant="icon">
                        <Users />
                     </EmptyMedia>
                     <EmptyTitle>
                        {type === 'followers' ? t('noFollowers') : type === 'following' ? t('noFollowing') : t('noPlatformFriends')}
                     </EmptyTitle>
                  </EmptyHeader>
               </Empty>
            )}
            {isFetchingNextPage && <p className="text-muted-foreground py-3 text-center text-xs">{t('loadingMore')}</p>}
         </div>
      </div>
   );
}
