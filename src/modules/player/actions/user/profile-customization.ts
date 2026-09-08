import { createServerFn } from '@tanstack/react-start';

import type { UserControllerUpdateProfileCustomizationPayload } from '@/shared/api/generated/Api';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionFailure, actionResultVoid } from '@/shared/result/action';

interface UpdatePinnedScoresInput {
   pinnedScores: {
      scoreId: number;
      comment: string;
   }[];
}

const backgroundMaxSize = 10 * 1024 * 1024;

const updatePinnedScoresFn = createServerFn({ method: 'POST' })
   .validator((data: UpdatePinnedScoresInput) => data)
   .handler(({ data }) =>
      actionResultVoid(
         api.user.userControllerUpdatePinnedScores({
            pinnedScores: data.pinnedScores
         })
      )
   );

const updateProfileCustomizationFn = createServerFn({ method: 'POST' })
   .validator((data: UserControllerUpdateProfileCustomizationPayload) => data)
   .handler(({ data }) => actionApiData(api.user.userControllerUpdateProfileCustomization(data)));

const uploadProfileBackgroundFn = createServerFn({ method: 'POST' })
   .validator((formData: FormData) => formData)
   .handler(({ data }) => uploadProfileBackgroundData(data));

const resetProfileBackgroundFn = createServerFn({ method: 'POST' }).handler(() =>
   actionApiData(api.user.userControllerResetProfileCustomizationBackground())
);

function uploadProfileBackgroundData(formData: FormData) {
   const backgroundImage = formData.get('backgroundImage');

   if (!(backgroundImage instanceof File) || backgroundImage.size === 0) {
      return actionFailure('Background image is required');
   }

   if (backgroundImage.size > backgroundMaxSize) {
      return actionFailure('Background image must be 10MB or smaller');
   }

   return actionApiData(
      api.user.userControllerUploadProfileCustomizationBackground({
         backgroundImage
      })
   );
}

export async function updatePinnedScores(input: UpdatePinnedScoresInput) {
   return updatePinnedScoresFn({ data: input });
}

export async function updateProfileCustomization(input: UserControllerUpdateProfileCustomizationPayload) {
   return updateProfileCustomizationFn({ data: input });
}

export async function uploadProfileBackground(formData: FormData) {
   return uploadProfileBackgroundFn({ data: formData });
}

export async function resetProfileBackground() {
   return resetProfileBackgroundFn();
}
