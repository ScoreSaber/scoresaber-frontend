import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
   plugins: [sveltekit()],
   envPrefix: ['VITE_', 'PUBLIC_'],
   ssr: {
      noExternal: ['chart.js']
   },
   optimizeDeps: {
      exclude: ['sswr']
   },
   build: {
      modulePreload: {
         polyfill: true
      },
      minify: 'esbuild',
      cssMinify: true,
      chunkSizeWarningLimit: 500,
      reportCompressedSize: true,
      assetsInlineLimit: 4096,
      rollupOptions: {
         output: {
            manualChunks: (id) => {
               if (id.includes('node_modules')) {
                  if (id.includes('chart.js')) {
                     return 'vendor-chart';
                  }
                  if (id.includes('tinymce') || id.includes('@tinymce')) {
                     return 'vendor-editor';
                  }
                  if (id.includes('jszip')) {
                     return 'vendor-zip';
                  }
                  if (id.includes('axios')) {
                     return 'vendor-http';
                  }
                  return 'vendor';
               }
            }
         }
      },
      target: 'es2015',
      sourcemap: false
   },
   server: {
      host: true,
      port: 3000
   }
};

export default config;
