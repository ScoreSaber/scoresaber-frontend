import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const INPUT = resolve(import.meta.dir, '..', 'orbis-openapi.json');
const OUTPUT = resolve(import.meta.dir, '..', 'orbis-openapi-processed.json');

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

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
   return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordEntries(value: unknown): Array<[string, JsonRecord]> {
   if (!isRecord(value)) return [];

   return Object.entries(value).filter((entry): entry is [string, JsonRecord] => isRecord(entry[1]));
}

function getString(value: unknown): string | undefined {
   return typeof value === 'string' ? value : undefined;
}

function getStringArray(value: unknown): string[] {
   return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : [];
}

function readJsonRecord(path: string): JsonRecord {
   const parsed: unknown = JSON.parse(readFileSync(path, 'utf-8'));
   if (!isRecord(parsed)) {
      throw new Error(`expected object JSON at ${path}`);
   }

   return parsed;
}

function main() {
   const spec = readJsonRecord(INPUT);

   const newPaths: Record<string, unknown> = {};
   for (const [path, methods] of recordEntries(spec.paths)) {
      const newMethods: Record<string, unknown> = {};
      for (const [method, details] of recordEntries(methods)) {
         if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
            newMethods[method] = details;
            continue;
         }

         const tags = getStringArray(details.tags);
         if (tags.some((t) => V1_TAGS.has(t))) continue;

         // strip _v2 suffix from operationId
         const operationId = getString(details.operationId);
         if (operationId) {
            details.operationId = operationId.replace(/_v2$/, '');
         }

         // normalize tag names
         details.tags = tags.map((t) => TAG_MAP[t] ?? t);

         newMethods[method] = details;
      }

      if (Object.keys(newMethods).length > 0) {
         newPaths[path] = newMethods;
      }
   }
   spec.paths = newPaths;

   // Update top-level tags array
   if (Array.isArray(spec.tags)) {
      spec.tags = spec.tags.filter(isRecord).flatMap((tag) => {
         const name = getString(tag.name);
         if (!name || V1_TAGS.has(name)) return [];

         return [{ ...tag, name: TAG_MAP[name] ?? name }];
      });
   }

   writeFileSync(OUTPUT, JSON.stringify(spec));
   console.log(`✔ Preprocessed spec -> ${OUTPUT}`);
}

main();
