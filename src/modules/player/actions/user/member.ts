import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';
import { toInt64PathParam } from '@/shared/url-state/params';

const disableAliasFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { playerId: string; aliasId: number }) => data)
   .handler(({ data }) =>
      actionResultVoid(api.playerAlias.playerAliasControllerDisableAlias({ id: toInt64PathParam(data.playerId), aliasId: data.aliasId }))
   );

const disableAllAliasesFn = createServerFn({ method: 'POST' })
   .inputValidator((playerId: string) => playerId)
   .handler(({ data }) => actionResultVoid(api.playerAlias.playerAliasControllerDisableAllAliases({ id: toInt64PathParam(data) })));

const followPlayerFn = createServerFn({ method: 'POST' })
   .inputValidator((playerId: string) => playerId)
   .handler(({ data }) => actionResultVoid(api.player.playerRelationshipControllerFollowPlayer({ id: toInt64PathParam(data) })));

const unfollowPlayerFn = createServerFn({ method: 'POST' })
   .inputValidator((playerId: string) => playerId)
   .handler(({ data }) => actionResultVoid(api.player.playerRelationshipControllerUnfollowPlayer({ id: toInt64PathParam(data) })));

export async function disableAlias(playerId: string, aliasId: number) {
   return disableAliasFn({ data: { playerId, aliasId } });
}

export async function disableAllAliases(playerId: string) {
   return disableAllAliasesFn({ data: playerId });
}

export async function followPlayer(playerId: string) {
   return followPlayerFn({ data: playerId });
}

export async function unfollowPlayer(playerId: string) {
   return unfollowPlayerFn({ data: playerId });
}
