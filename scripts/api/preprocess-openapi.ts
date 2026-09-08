import { z } from 'zod';

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const INPUT = resolve(import.meta.dirname, 'openapi.json');
const OUTPUT = resolve(import.meta.dirname, 'openapi.processed.json');

// Map new tag names back to the old module-name convention (singular, no spaces/colons)
const TAG_MAP: Record<string, string> = {
   Players: 'Player',
   'Player Aliases': 'PlayerAlias',
   Leaderboards: 'Leaderboard',
   Maps: 'Map',
   Authentication: 'Auth',
   Scores: 'Score',
   'Admin: Badges': 'AdminBadge',
   'Admin: Leaderboards': 'AdminLeaderboard',
   'Admin: Permissions': 'AdminPermission',
   'Admin: Scores': 'AdminScore',
   'Admin: Users': 'AdminUser',
   'Admin: Versions': 'AdminVersion',
   Realms: 'Realm'
};

const V1_TAGS = new Set(['V1: Game', 'V1: Main']);

const jsonObjectSchema = z.looseObject({});
const operationSchema = z.object({
   operationId: z.string().optional().catch(undefined),
   tags: z.array(z.string()).catch([])
});
const tagSchema = z.object({ name: z.string().optional().catch(undefined) });
const tagArraySchema = z.array(z.unknown());

function main() {
   const spec = jsonObjectSchema.parse(JSON.parse(readFileSync(INPUT, 'utf-8')));
   const paths = jsonObjectSchema.catch({}).parse(spec.paths);

   const newPaths: typeof paths = {};
   for (const [path, rawMethods] of Object.entries(paths)) {
      const methods = jsonObjectSchema.safeParse(rawMethods);
      if (!methods.success) continue;

      const newMethods: typeof methods.data = {};
      for (const [method, rawDetails] of Object.entries(methods.data)) {
         const details = jsonObjectSchema.safeParse(rawDetails);
         if (!details.success) continue;

         if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
            newMethods[method] = details.data;
            continue;
         }

         const operation = operationSchema.parse(details.data);
         const tags = operation.tags;
         if (tags.some((t) => V1_TAGS.has(t))) continue;

         // strip _v2 suffix from operationId
         if (operation.operationId) {
            details.data.operationId = operation.operationId.replace(/_v2$/, '');
         }

         // normalize tag names
         details.data.tags = tags.map((t) => TAG_MAP[t] ?? t);

         newMethods[method] = details.data;
      }

      if (Object.keys(newMethods).length > 0) {
         newPaths[path] = newMethods;
      }
   }
   spec.paths = newPaths;

   // Update top-level tags array
   const tags = tagArraySchema.safeParse(spec.tags);
   if (tags.success) {
      spec.tags = tags.data.flatMap((rawTag) => {
         const tag = jsonObjectSchema.safeParse(rawTag);
         if (!tag.success) return [];

         const name = tagSchema.parse(tag.data).name;
         if (!name || V1_TAGS.has(name)) return [];

         return [{ ...tag.data, name: TAG_MAP[name] ?? name }];
      });
   }

   writeFileSync(OUTPUT, JSON.stringify(spec));
   console.log(`✔ Preprocessed spec -> ${OUTPUT}`);
}

main();
