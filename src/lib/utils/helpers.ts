import { CDN_URL } from './env';
export function rankToPage(rank: number, perPage: number) {
   return Math.floor((rank + perPage - 1) / perPage);
}
export function getCDNUrl(input: string) {
   return CDN_URL + input;
}
