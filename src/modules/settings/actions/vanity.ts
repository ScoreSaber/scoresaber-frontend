import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData } from '@/shared/result/action';

const getVanityFn = createServerFn({ method: 'GET' }).handler(() => actionApiData(api.user.userControllerGetVanity({ cache: 'no-store' })));

export async function getVanity() {
   return getVanityFn();
}

const claimVanityFn = createServerFn({ method: 'POST' })
   .validator((slug: string) => slug)
   .handler(({ data }) => actionApiData(api.user.userControllerClaimVanity({ slug: data })));

export async function claimVanity(slug: string) {
   return claimVanityFn({ data: slug });
}
