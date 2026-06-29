import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiVoid } from '@/shared/result/action';

interface UpdatePinnedScoresInput {
   pinnedScores: {
      scoreId: number;
      comment: string;
   }[];
}

const updatePinnedScoresFn = createServerFn({ method: 'POST' })
   .inputValidator((data: UpdatePinnedScoresInput) => data)
   .handler(({ data }) => actionApiVoid(api.user.userControllerUpdatePinnedScores({ pinnedScores: data.pinnedScores })));

export async function updatePinnedScores(input: UpdatePinnedScoresInput) {
   return updatePinnedScoresFn({ data: input });
}
