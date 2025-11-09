import { env } from '$env/dynamic/public';

export const CDN_URL: string = (env.PUBLIC_CDN_URL as string) || 'https://cdn.scoresaber.com';
export const API_URL: string = (env.PUBLIC_API_URL as string) || 'https://scoresaber.com';
