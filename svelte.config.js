import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
   // Consult https://github.com/sveltejs/svelte-preprocess
   // for more information about preprocessors
   preprocess: preprocess({
      scss: {
         includePaths: ['./src/styles'],
         prependData: `@import 'src/styles/scoresaber.scss';`
      }
   }),

   kit: {
      //   ssr: false,
      adapter: adapter({
         // default options are shown
         out: 'build',
         precompress: false,
         env: {
            host: 'HOST',
            port: 'PORT'
         }
      }),
      // hydrate the <div id="svelte"> element in src/app.html
      target: '#svelte',
      vite: {
         optimizeDeps: {
            exclude: ['sswr']
         }
      }
   }
};

export default config;
