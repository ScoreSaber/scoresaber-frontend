import { createServerFn } from '@tanstack/react-start';

import type { PlayerReportControllerSubmitProfileReportPayload } from '@/shared/api/generated/Api';
import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';
import { toInt64PathParam } from '@/shared/url-state/params';

type PlayerReportReason = PlayerReportControllerSubmitProfileReportPayload['reason'];

const disableAliasFn = createServerFn({ method: 'POST' })
   .validator((data: { playerId: string; aliasId: number }) => data)
   .handler(({ data }) =>
      actionResultVoid(api.playerAlias.playerAliasControllerDisableAlias({ id: toInt64PathParam(data.playerId), aliasId: data.aliasId }))
   );

const disableAllAliasesFn = createServerFn({ method: 'POST' })
   .validator((playerId: string) => playerId)
   .handler(({ data }) => actionResultVoid(api.playerAlias.playerAliasControllerDisableAllAliases({ id: toInt64PathParam(data) })));

const followPlayerFn = createServerFn({ method: 'POST' })
   .validator((playerId: string) => playerId)
   .handler(({ data }) => actionResultVoid(api.player.playerRelationshipControllerFollowPlayer({ id: toInt64PathParam(data) })));

const unfollowPlayerFn = createServerFn({ method: 'POST' })
   .validator((playerId: string) => playerId)
   .handler(({ data }) => actionResultVoid(api.player.playerRelationshipControllerUnfollowPlayer({ id: toInt64PathParam(data) })));

const reportPlayerFn = createServerFn({ method: 'POST' })
   .validator((data: { playerId: string; reason: PlayerReportReason; details?: string }) => data)
   .handler(({ data }) =>
      actionResultVoid(
         api.player.playerReportControllerSubmitProfileReport(
            { id: toInt64PathParam(data.playerId) },
            {
               reason: data.reason,
               details: data.details ?? ''
            }
         )
      )
   );

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

export async function reportPlayer(playerId: string, reason: PlayerReportReason, details?: string) {
   return reportPlayerFn({ data: { playerId, reason, details } });
}

export type { PlayerReportReason };
