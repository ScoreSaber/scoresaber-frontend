import { Result } from 'better-result';

const PERSISTED_SEARCH_COOKIE_PREFIX = 'ss-persisted-search-';
const PERSISTED_SEARCH_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getPersistedSearchCookieName(storageKey: string) {
   return `${PERSISTED_SEARCH_COOKIE_PREFIX}${storageKey}`;
}

function parsePersistedSearchCookieValue(value: string | undefined): Record<string, string> {
   if (!value) return {};

   const result = Result.try({
      try: () => parsePersistedSearchCookieJson(value),
      catch: () => null
   });
   const parsed = Result.unwrapOr(result, null);
   if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

   const record: Record<string, string> = {};
   for (const [key, raw] of Object.entries(parsed)) {
      if (typeof raw === 'string') record[key] = raw;
   }

   return record;
}

function parsePersistedSearchCookieJson(value: string): unknown {
   return JSON.parse(decodeURIComponent(value));
}

function serializePersistedSearchCookieValue(value: Record<string, string>) {
   return encodeURIComponent(JSON.stringify(value));
}

function readPersistedSearchCookieValue(storageKey: string) {
   if (typeof document === 'undefined') return {};

   const cookieName = `${getPersistedSearchCookieName(storageKey)}=`;
   const cookie = document.cookie
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(cookieName));

   return parsePersistedSearchCookieValue(cookie?.slice(cookieName.length));
}

export {
   getPersistedSearchCookieName,
   parsePersistedSearchCookieValue,
   PERSISTED_SEARCH_COOKIE_MAX_AGE,
   readPersistedSearchCookieValue,
   serializePersistedSearchCookieValue
};
