export function getSetCookieHeaders(headers: Headers) {
   if ('getSetCookie' in headers && typeof headers.getSetCookie === 'function') {
      return headers.getSetCookie();
   }

   const setCookie = headers.get('set-cookie');
   return setCookie ? [setCookie] : [];
}
