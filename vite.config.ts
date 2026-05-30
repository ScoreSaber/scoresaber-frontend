import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import { nitro } from 'nitro/vite';
import { createLogger, defineConfig, loadEnv } from 'vite';

const localHostnames = new Set(['localhost', '0.0.0.0', '127.0.0.1', '[::1]']);
const logger = createLogger();
const warn = logger.warn;
const warnOnce = logger.warnOnce;

logger.warn = (message, options) => {
   if (isNoisyDependencySourcemapWarning(message)) return;
   warn(message, options);
};

logger.warnOnce = (message, options) => {
   if (isNoisyDependencySourcemapWarning(message)) return;
   warnOnce(message, options);
};

function getLocalArcviewerUrl(arcviewerUrl: string | undefined) {
   if (!arcviewerUrl || !URL.canParse(arcviewerUrl)) return null;

   const url = new URL(arcviewerUrl);
   if (url.protocol !== 'http:' || !localHostnames.has(url.hostname)) return null;

   return arcviewerUrl.replace(/\/$/, '');
}

export default defineConfig(({ mode }) => {
   const env = loadEnv(mode, process.cwd(), '');
   const localArcviewerUrl = getLocalArcviewerUrl(env.NEXT_PUBLIC_ARCVIEWER_URL);

   return {
      customLogger: logger,
      envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
      server: {
         allowedHosts: ['scoresaber.local', '.scoresaber.local'],
         sourcemapIgnoreList: (sourcePath) => sourcePath.includes('/node_modules/'),
         ...(localArcviewerUrl
            ? {
                 proxy: {
                    '/watch': {
                       target: localArcviewerUrl,
                       changeOrigin: true,
                       rewrite: (path: string) => (path === '/watch' || path === '/watch/index.html' ? '/' : path.replace(/^\/watch/, ''))
                    }
                 }
              }
            : {})
      },
      plugins: [
         tanstackStart({
            rsc: { enabled: true },
            router: {
               codeSplittingOptions: {
                  splitBehavior: ({ routeId }) => (routeId === '/legal/cookies-policy' ? [] : undefined)
               }
            }
         }),
         nitro({ preset: 'node-server' }),
         rsc(),
         viteReact(),
         tailwindcss()
      ],
      resolve: {
         tsconfigPaths: true,
         alias: {
            tslib: 'tslib/tslib.es6.mjs'
         }
      }
   };
});

function isNoisyDependencySourcemapWarning(message: string) {
   return message.includes('Failed to load source map for') || (message.includes('Sourcemap for') && message.includes('node_modules'));
}
