import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
   extensions: ['.svelte', ...mdsvexConfig.extensions],

   // Consult https://github.com/sveltejs/svelte-preprocess
   // for more information about preprocessors
   preprocess: [preprocess(), mdsvex(mdsvexConfig)],

   kit: {
      //   ssr: false,
      adapter: adapter({
         // default options are shown
         out: 'build',
         precompress: false,
         envPrefix: {
            host: 'HOST',
            port: 'PORT'
         }
      })
   }
};

export default config;
