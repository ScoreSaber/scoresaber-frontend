import '@tanstack/react-start/server-only';

import { getRequestHeaders } from '@tanstack/react-start/server';

export function isMacRequest() {
   const headers = getRequestHeaders();
   const platform = headers.get('sec-ch-ua-platform')?.replaceAll('"', '');
   if (platform) return platform === 'macOS' || platform === 'iOS';

   return /(Mac|iPhone|iPod|iPad)/i.test(headers.get('user-agent') ?? '');
}
