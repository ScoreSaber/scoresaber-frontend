'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/modules/auth';
import { disableAlias, disableAllAliases } from '@/modules/player/actions/user/member';
import type { PlayerAliasControllerGetAliasesItem } from '@/shared/api/generated/ApiParams';
import Permissions from '@/shared/permissions';

interface PlayerAliasesProps {
   aliases: PlayerAliasControllerGetAliasesItem[];
   playerId: string;
}

export function PlayerAliases({ aliases, playerId }: PlayerAliasesProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const isOwnProfile = user?.id === playerId;
   const isAdmin = Permissions.checkPermissionNumber(user?.permissions ?? 0, Permissions.security.ADMIN);
   const canDelete = isOwnProfile || isAdmin;

   const [aliasList, setAliasList] = useState(aliases);
   const activeAliases = aliasList.filter((a) => !a.disabled);
   const disabledAliases = aliasList.filter((a) => a.disabled);
   const [disablingId, setDisablingId] = useState<number | null>(null);
   const [clearingAll, setClearingAll] = useState(false);
   const busy = disablingId !== null || clearingAll;

   if (activeAliases.length === 0 && (!isAdmin || disabledAliases.length === 0)) return null;

   function markDisabled(ids: number[]) {
      if (isAdmin) {
         // move to disabled section
         setAliasList((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, disabled: true } : a)));
      } else {
         // remove from list entirely
         setAliasList((prev) => prev.filter((a) => !ids.includes(a.id)));
      }
   }

   async function handleDisable(aliasId: number) {
      setDisablingId(aliasId);
      const result = await disableAlias(playerId, aliasId);
      if (result.ok) {
         markDisabled([aliasId]);
         toast.success(t('player.aliasRemoved'));
      } else {
         toast.error(t('player.failedToRemoveAlias'));
      }
      setDisablingId(null);
   }

   async function handleClearAll() {
      setClearingAll(true);
      const result = await disableAllAliases(playerId);
      if (result.ok) {
         markDisabled(activeAliases.map((a) => a.id));
         toast.success(t('player.allAliasesCleared'));
      } else {
         toast.error(t('player.failedToClearAliases'));
      }
      setClearingAll(false);
   }

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="ghost"
               size="icon-xs"
               className="text-muted-foreground hover:text-foreground size-auto p-0 hover:bg-transparent"
               aria-label={t('player.viewPreviousNames')}
            >
               <FaChevronDown data-icon />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto min-w-48 cursor-default p-3" align="start">
            {activeAliases.length > 0 && (
               <>
                  <div className="mb-2 flex items-center justify-between">
                     <p className="text-muted-foreground text-xs font-medium">{t('player.previousNames')}</p>
                     {canDelete && activeAliases.length > 0 && (
                        <Button
                           variant="ghost-icon"
                           size="xs"
                           onClick={handleClearAll}
                           disabled={busy}
                           className="relative h-auto cursor-pointer px-0 py-0"
                        >
                           <span className={clearingAll ? 'invisible' : undefined}>{t('player.clearAllAliases')}</span>
                           {clearingAll && <Loader2 className="absolute size-3.5 animate-spin" />}
                        </Button>
                     )}
                  </div>
                  <ul className="flex flex-col gap-1">
                     {activeAliases.map((alias) => (
                        <li key={alias.id} className="flex items-center justify-between gap-2 text-sm">
                           <span>{alias.alias}</span>
                           {canDelete && (
                              <Button
                                 variant="ghost-icon"
                                 size="icon-xs"
                                 onClick={() => handleDisable(alias.id)}
                                 disabled={busy}
                                 className="size-auto cursor-pointer p-0"
                                 aria-label={t('player.removeAlias')}
                              >
                                 {disablingId === alias.id ? <Loader2 data-icon className="animate-spin" /> : <FaTimes data-icon />}
                              </Button>
                           )}
                        </li>
                     ))}
                  </ul>
               </>
            )}

            {/* disabled aliases -- admin only */}
            {isAdmin && disabledAliases.length > 0 && (
               <>
                  {activeAliases.length > 0 && <Separator className="my-2" />}
                  <p className="text-muted-foreground mb-2 text-xs font-medium">{t('player.disabledAliases')}</p>
                  <ul className="flex flex-col gap-1">
                     {disabledAliases.map((alias) => (
                        <li key={alias.id} className="text-muted-foreground/50 text-sm">
                           {alias.alias}
                        </li>
                     ))}
                  </ul>
               </>
            )}
         </PopoverContent>
      </Popover>
   );
}
