import { env } from '@/env';

const localArcviewerHostnames = new Set(['localhost', '0.0.0.0', '127.0.0.1', '[::1]']);

export function getArcviewerUrl(params: Record<string, string>) {
   const arcviewerUrl = new URL(env.NEXT_PUBLIC_ARCVIEWER_URL);
   arcviewerUrl.search = new URLSearchParams(params).toString();

   return arcviewerUrl.toString();
}

export function getReplayArcviewerUrl(params: Record<string, string>) {
   const arcviewerUrl = new URL(env.NEXT_PUBLIC_ARCVIEWER_URL);
   const searchParams = new URLSearchParams(params);

   if (arcviewerUrl.protocol === 'http:' && (localArcviewerHostnames.has(arcviewerUrl.hostname) || arcviewerUrl.hostname.endsWith('.localhost'))) {
      return `/watch/index.html?${searchParams.toString()}`;
   }

   const viewerUrl = new URL('/', arcviewerUrl);
   viewerUrl.pathname = `${arcviewerUrl.pathname.replace(/\/$/, '')}/`;
   viewerUrl.search = searchParams.toString();

   return viewerUrl.toString();
}
