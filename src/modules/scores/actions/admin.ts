import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';

const deleteScoreFn = createServerFn({ method: 'POST' })
   .validator((scoreId: number) => scoreId)
   .handler(({ data }) => actionResultVoid(api.adminScore.adminScoreControllerDeleteScore({ id: data })));

export async function deleteScore(scoreId: number) {
   return deleteScoreFn({ data: scoreId });
}
