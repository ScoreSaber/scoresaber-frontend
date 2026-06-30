import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData, actionApiVoid } from '@/shared/result/action';

interface UpdatePinnedScoresInput {
   pinnedScores: {
      scoreId: number;
      comment: string;
   }[];
}

export interface UpdateProfileCustomizationStyleInput {
   accentColor: string | null;
   accentForegroundColor: string | null;
   supporterNameColorEnabled: boolean;
}

const updatePinnedScoresFn = createServerFn({ method: 'POST' })
   .inputValidator((data: UpdatePinnedScoresInput) => data)
   .handler(({ data }) => actionApiVoid(api.user.userControllerUpdatePinnedScores({ pinnedScores: data.pinnedScores })));

const updateProfileCustomizationStyleFn = createServerFn({ method: 'POST' })
   .inputValidator((data: UpdateProfileCustomizationStyleInput) => data)
   .handler(({ data }) => actionApiData(api.user.userControllerUpdateProfileCustomizationStyle(data)));

export async function updatePinnedScores(input: UpdatePinnedScoresInput) {
   return updatePinnedScoresFn({ data: input });
}

export async function updateProfileCustomizationStyle(input: UpdateProfileCustomizationStyleInput) {
   return updateProfileCustomizationStyleFn({ data: input });
}
