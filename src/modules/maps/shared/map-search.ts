export const MIN_TEXT_MAP_SEARCH_LENGTH = 3;

const mapHashSearch = /^[a-f0-9]{40}$/i;
const beatSaverKeySearch = /^[a-f0-9]{1,32}$/i;

export function isMapIdentifierSearch(value: string) {
   const trimmed = value.trim();
   if (!trimmed) return false;

   const identifier = extractBeatSaverKeyFromSearch(trimmed) ?? trimmed;
   return mapHashSearch.test(identifier) || beatSaverKeySearch.test(identifier);
}

export function isMapSearchReady(value: string) {
   const trimmed = value.trim();
   return trimmed.length >= MIN_TEXT_MAP_SEARCH_LENGTH || isMapIdentifierSearch(trimmed);
}

function extractBeatSaverKeyFromSearch(search: string) {
   const match = /(?:^|\/)maps\/([a-z0-9]{1,32})(?:[/?#]|$)/i.exec(search);
   return match?.[1];
}
