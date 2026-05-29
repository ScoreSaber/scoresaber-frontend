import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionFailure, actionResultVoid } from '@/shared/result/action';
import { sanitizeRichTextHtml } from '@/shared/rich-text/server';

const bioMaxLength = 4096;
const avatarMaxSize = 10 * 1024 * 1024;

const uploadAvatarFn = createServerFn({ method: 'POST' })
   .inputValidator((formData: FormData) => formData)
   .handler(({ data }) => uploadAvatarData(data));

const updateBioFn = createServerFn({ method: 'POST' })
   .inputValidator((bio: string) => bio)
   .handler(({ data }) => updateBioData(data));

const updateNameFn = createServerFn({ method: 'POST' })
   .inputValidator((name: string) => name)
   .handler(({ data }) => actionResultVoid(api.user.userControllerUpdateName({ name: data })));

const requestCountryResetFn = createServerFn({ method: 'POST' }).handler(() => actionResultVoid(api.user.userControllerResetCountry()));

function uploadAvatarData(formData: FormData) {
   const avatar = formData.get('avatar');

   if (!(avatar instanceof File) || avatar.size === 0) {
      return actionFailure('Avatar is required');
   }

   if (avatar.size > avatarMaxSize) {
      return actionFailure('Avatar must be 10MB or smaller');
   }

   return actionResultVoid(api.user.userControllerUploadAvatar({ avatar }));
}

function updateBioData(bio: string) {
   const sanitizedBio = sanitizeRichTextHtml(bio);

   if (sanitizedBio.length > bioMaxLength) {
      return actionFailure('Bio is too long');
   }

   return actionResultVoid(api.user.userControllerUpdateBio({ bio: sanitizedBio }));
}

export async function uploadAvatar(formData: FormData) {
   return uploadAvatarFn({ data: formData });
}

export async function updateBio(bio: string) {
   return updateBioFn({ data: bio });
}

export async function updateName(name: string) {
   return updateNameFn({ data: name });
}

export async function requestCountryReset() {
   return requestCountryResetFn();
}
