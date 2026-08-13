import '@tanstack/react-start/server-only';

import { getCookie, getRequest, setCookie } from '@tanstack/react-start/server';
import { Result, TaggedError } from 'better-result';

import { Api } from './generated/Api';
import { addVisitorRateLimitHeaders } from './visitor-rate-limit';
import { VISITOR_COOKIE_MAX_AGE, VISITOR_COOKIE_NAME, VISITOR_HEADER_NAME } from './visitor-rate-limit-constants';

import { env } from '@/env';
import { readAuthCookie } from '@/modules/auth/actions/session.server';

const authenticatedFetchCache: RequestInit = { cache: 'no-store' };
const publicFetchCache: RequestInit = {};
const authenticatedCredentials: RequestCredentials = 'include';
const publicCredentials: RequestCredentials = 'omit';
const requestVisitorIds = new WeakMap<Request, string>();
const VISITOR_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SessionCookieReadError extends TaggedError('SessionCookieReadError')<{
   message: string;
   cause: unknown;
}>() {}

async function readSessionToken() {
   const result = await Result.tryPromise({
      try: async () => {
         return readAuthCookie();
      },
      catch: (cause) =>
         new SessionCookieReadError({
            message: 'failed to read session cookie',
            cause
         })
   });

   return Result.unwrapOr(result, null);
}

async function readVisitorIdCookie() {
   const result = await Result.tryPromise({
      try: async () => {
         return getCookie(VISITOR_COOKIE_NAME) ?? null;
      },
      catch: (cause) =>
         new SessionCookieReadError({
            message: 'failed to read visitor cookie',
            cause
         })
   });

   return Result.unwrapOr(result, null);
}

async function readOrCreateVisitorId() {
   const existingVisitorId = await readVisitorIdCookie();
   if (existingVisitorId && VISITOR_ID_PATTERN.test(existingVisitorId)) return existingVisitorId;

   const request = getRequest();
   const requestVisitorId = requestVisitorIds.get(request);
   if (requestVisitorId) return requestVisitorId;

   const visitorId = crypto.randomUUID();
   requestVisitorIds.set(request, visitorId);
   setCookie(VISITOR_COOKIE_NAME, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE
   });

   return visitorId;
}

function addCloudflareAccessHeaders(headers: Record<string, string>) {
   if (!env.CF_ACCESS_CLIENT_ID || !env.CF_ACCESS_CLIENT_SECRET) return false;

   headers['CF-Access-Client-Id'] = env.CF_ACCESS_CLIENT_ID;
   headers['CF-Access-Client-Secret'] = env.CF_ACCESS_CLIENT_SECRET;
   return true;
}

function getDefaultFetchCache(init?: RequestInit) {
   if (init && 'cache' in init) return {};

   const headers = new Headers(init?.headers);
   const cookieHeader = headers.get('Cookie') ?? '';
   const isAuthenticated = cookieHeader.includes('token=') && !cookieHeader.includes('token=null');
   const isVisitorScoped = headers.has(VISITOR_HEADER_NAME);
   return isAuthenticated || isVisitorScoped ? authenticatedFetchCache : publicFetchCache;
}

function createServerFetch(credentials: RequestCredentials) {
   return (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (env.CF_ACCESS_CLIENT_ID && env.CF_ACCESS_CLIENT_SECRET) {
         headers.set('CF-Access-Client-Id', env.CF_ACCESS_CLIENT_ID);
         headers.set('CF-Access-Client-Secret', env.CF_ACCESS_CLIENT_SECRET);
      }

      return fetch(input, {
         ...init,
         headers,
         credentials,
         ...getDefaultFetchCache(init)
      });
   };
}

const authenticatedFetch = createServerFetch(authenticatedCredentials);
const publicFetch = createServerFetch(publicCredentials);

export const publicApi = new Api({
   baseUrl: env.API_URL,
   baseApiParams: { secure: true, credentials: publicCredentials },
   securityWorker: async () => {
      const publicHeaders: Record<string, string> = {};
      const hasCloudflareAccessHeaders = addCloudflareAccessHeaders(publicHeaders);
      const visitorId = await readOrCreateVisitorId();
      const hasVisitorRateLimitHeaders = addVisitorRateLimitHeaders(publicHeaders, visitorId);

      return hasCloudflareAccessHeaders || hasVisitorRateLimitHeaders ? { headers: publicHeaders } : {};
   },
   customFetch: publicFetch
});

export const api = new Api({
   baseUrl: env.API_URL,
   baseApiParams: { secure: true, credentials: authenticatedCredentials },
   securityWorker: async () => {
      const [token, visitorId] = await Promise.all([readSessionToken(), readOrCreateVisitorId()]);
      const headers: Record<string, string> = {};
      const hasCloudflareAccessHeaders = addCloudflareAccessHeaders(headers);
      const hasVisitorRateLimitHeaders = addVisitorRateLimitHeaders(headers, visitorId);

      if (!token) {
         return hasCloudflareAccessHeaders || hasVisitorRateLimitHeaders ? { headers } : {};
      }

      headers.Cookie = `token=${token}`;
      return {
         headers,
         credentials: 'include'
      };
   },
   customFetch: authenticatedFetch
});
