import '@tanstack/react-start/server-only';

import { getRequestHeaders } from '@tanstack/react-start/server';

const CLIENT_IP_HEADER = 'x-scoresaber-client-ip';
const CLIENT_COUNTRY_HEADER = 'x-scoresaber-client-country';
const CLIENT_USER_AGENT_HEADER = 'x-scoresaber-client-user-agent';

export function getClientRequestHeaders() {
   const requestHeaders = getRequestHeaders();
   const headers: Record<string, string> = {};
   const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
   const clientIp = requestHeaders.get('cf-connecting-ip') ?? requestHeaders.get('x-real-ip') ?? forwardedFor ?? null;
   const clientCountry = getClientCountry(requestHeaders);
   const userAgent = requestHeaders.get('user-agent');

   if (clientIp) {
      headers[CLIENT_IP_HEADER] = clientIp;
   }

   if (clientCountry) {
      headers[CLIENT_COUNTRY_HEADER] = clientCountry;
   }

   if (userAgent) {
      headers[CLIENT_USER_AGENT_HEADER] = userAgent;
   }

   return headers;
}

function getClientCountry(requestHeaders: Headers) {
   const country = requestHeaders.get('cf-ipcountry')?.trim().toUpperCase();
   return country && /^[A-Z]{2}$/.test(country) && country !== 'XX' ? country : null;
}
