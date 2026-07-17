import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';

const claimReplaySlotFn = createServerFn({ method: 'POST' })
   .inputValidator((scoreId: number) => scoreId)
   .handler(({ data }) => actionResultVoid(api.user.userControllerClaimReplaySlot({ scoreId: data })));

const releaseReplaySlotFn = createServerFn({ method: 'POST' })
   .inputValidator((scoreId: number) => scoreId)
   .handler(({ data }) => actionResultVoid(api.user.userControllerReleaseReplaySlot({ scoreId: data })));

export async function claimReplaySlot(scoreId: number) {
   return claimReplaySlotFn({ data: scoreId });
}

export async function releaseReplaySlot(scoreId: number) {
   return releaseReplaySlotFn({ data: scoreId });
}
