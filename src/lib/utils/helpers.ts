export function rankToPage(rank: number, perPage: number) {
   return Math.floor((rank + perPage - 1) / perPage);
}
