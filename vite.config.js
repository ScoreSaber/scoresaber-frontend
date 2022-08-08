import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
   plugins: [sveltekit()],
   ssr: {
      noExternal: ['chart.js']
   },
   optimizeDeps: {
      exclude: ['sswr']
   }
};

export default config;
