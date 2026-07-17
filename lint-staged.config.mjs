import { relative } from 'node:path';

const ignoredFiles = new Set(['src/routeTree.gen.ts']);

export default {
   '*.{js,jsx,ts,tsx}': (files) => {
      const filteredFiles = files.filter((file) => !ignoredFiles.has(relative(process.cwd(), file).replaceAll('\\', '/')));
      if (filteredFiles.length === 0) return [];

      const args = filteredFiles.map((file) => JSON.stringify(file)).join(' ');

      return [`bunx oxfmt ${args}`, `bunx oxlint --fix ${args}`];
   }
};
