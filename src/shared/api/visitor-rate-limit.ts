import { VISITOR_HEADER_NAME, VISITOR_SIGNATURE_HEADER_NAME } from './visitor-rate-limit-constants';

import { env } from '@/env';

import { createHmac } from 'node:crypto';

export function getVisitorRateLimitSecret() {
   return env.VISITOR_RATE_LIMIT_SECRET ?? null;
}

export function signVisitorId(visitorId: string) {
   const secret = getVisitorRateLimitSecret();
   if (!secret) return null;

   return createHmac('sha256', secret).update(visitorId).digest('hex');
}

export function addVisitorRateLimitHeaders(headers: Record<string, string>, visitorId: string | null | undefined) {
   if (!visitorId) return false;

   const signature = signVisitorId(visitorId);
   if (!signature) return false;

   headers[VISITOR_HEADER_NAME] = visitorId;
   headers[VISITOR_SIGNATURE_HEADER_NAME] = signature;
   return true;
}
