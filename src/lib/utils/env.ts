import { env } from '$env/dynamic/public';

export const CDN_URL: string = env.PUBLIC_CDN_URL as string;
export const API_URL: string = (env.PUBLIC_API_URL as string) ?? '';
export const API_KEY: string = env.PUBLIC_API_KEY as string;
export const CACHE_EXPIRY_IN_MINUTES: string = env.PUBLIC_CACHE_EXPIRY_IN_MINUTES as string;
