import { Err, Ok, Result, TaggedError } from 'better-result';
import ts from 'typescript';

import { readdirSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

type Viewport = 'desktop' | 'mobile';

interface TranslationUsage {
   file: string;
   key: string;
   line: number;
   url: string;
   viewport: Viewport;
}

interface ContextEntry {
   context: string;
   key: string;
   source: string;
   usages: TranslationUsage[];
}

interface CrowdinString {
   context?: string | null;
   id: number;
   identifier?: string | null;
}

interface CrowdinListResponse {
   data: Array<{ data: CrowdinString }>;
   pagination: {
      limit: number;
      offset: number;
      total: number;
   };
}

interface ContextUpdate {
   currentContext: string;
   key: string;
   nextContext: string;
   source: string;
   stringId: number;
}

interface CrowdinSyncPlan {
   matched: number;
   missing: string[];
   skipped: number;
   updates: ContextUpdate[];
}

class CrowdinRequestError extends TaggedError('CrowdinRequestError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

type CrowdinResult<T> = Ok<T, CrowdinRequestError> | Err<T, CrowdinRequestError>;

const siteUrl = 'https://scoresaber.com';
const mapUrl = `${siteUrl}/map/13935`;
const playerUrl = `${siteUrl}/u/76561198283584459`;
const contextParam = 'ssctx';
const contextBlockStart = '[scoresaber-context:start]';
const contextBlockEnd = '[scoresaber-context:end]';
const sourceRoot = resolve('src');
const sourceStrings = flattenMessages(JSON.parse(readFileSync(resolve('messages/en.json'), 'utf8')));
const shouldApply = Bun.argv.includes('--apply');
const shouldUseRemote = shouldApply || Bun.argv.includes('--remote');
const crowdinProjectId = process.env.CROWDIN_PROJECT_ID ?? '';
const crowdinPersonalToken = process.env.CROWDIN_PERSONAL_TOKEN ?? '';
const crowdinApiBaseUrl = process.env.CROWDIN_API_BASE_URL ?? 'https://api.crowdin.com/api/v2';
const skippedPathParts = ['/dialog', '/popover', '/hover-card', '/omni-search'];
const skippedJsxPrefixes = ['Dialog', 'Popover', 'Sheet', 'DropdownMenu', 'Command', 'AlertDialog', 'Tooltip'];
const skippedJsxNames = new Set(['ConfirmDialog']);
const skippedJsxAttributes = new Set(['alt', 'title']);
const routeRules: Array<[string[], string]> = [
   [['/routes/legal/privacy', 'legal/privacy'], `${siteUrl}/legal/privacy`],
   [['/routes/legal/cookies'], `${siteUrl}/legal/cookies-policy`],
   [['/routes/legal/copyright'], `${siteUrl}/legal/copyright`],
   [['/routes/team', '/modules/team/'], `${siteUrl}/team`],
   [['/routes/quest', '/modules/quest/'], `${siteUrl}/quest`],
   [['/routes/login', '/modules/auth/'], `${siteUrl}/login`],
   [['/routes/settings/connections', '/modules/settings/sections/connections'], `${siteUrl}/settings/connections`],
   [['/routes/settings/perks/replays'], `${siteUrl}/settings/perks/replays`],
   [['/routes/settings/perks/score-saber-2-badge'], `${siteUrl}/settings/perks/score-saber-2-badge`],
   [['/routes/settings/perks', '/modules/settings/'], `${siteUrl}/settings/account`],
   [['/routes/rankings', '/modules/rankings/'], `${siteUrl}/rankings`],
   [['/routes/ranking/', '/modules/rank-requests/'], `${siteUrl}/ranking/requests`],
   [['/routes/u/', '/modules/player/'], playerUrl],
   [['/routes/map/', '/modules/maps/detail/', '/modules/songs/', '/shared/components/comments/'], mapUrl]
];

const usages = scanSourceFiles(sourceRoot)
   .flatMap(scanFile)
   .filter((usage) => sourceStrings.has(usage.key));
const contexts = buildContextEntries(usages);
const outputPath = getOutputPath();

if (shouldUseRemote) {
   const missingEnvNames = ['CROWDIN_PROJECT_ID', 'CROWDIN_PERSONAL_TOKEN'].filter((name) => !process.env[name]);
   if (missingEnvNames.length > 0) {
      console.error(`${missingEnvNames.join(', ')} required for remote Crowdin context sync`);
      process.exit(1);
   }

   const syncPlanResult = await buildCrowdinSyncPlan(contexts);
   if (Result.isError(syncPlanResult)) {
      console.error(syncPlanResult.error.message);
      process.exit(1);
   }

   const syncPlan = syncPlanResult.value;

   if (outputPath) {
      await Bun.write(outputPath, `${JSON.stringify(syncPlan, null, 3)}\n`);
   }

   console.log(
      [
         `generated ${contexts.length} context entries`,
         `found ${syncPlan.matched} matching Crowdin strings`,
         `skipped ${syncPlan.skipped} strings that already have current context`,
         `${syncPlan.missing.length} generated keys were not found in Crowdin`,
         `${syncPlan.updates.length} strings need context updates`
      ].join('\n')
   );

   if (shouldApply) {
      const applyResult = await applyCrowdinContextUpdates(syncPlan.updates);
      if (Result.isError(applyResult)) {
         console.error(applyResult.error.message);
         process.exit(1);
      }

      console.log(`updated ${applyResult.value} Crowdin string contexts`);
   }
} else if (outputPath) {
   await Bun.write(outputPath, `${JSON.stringify(contexts, null, 3)}\n`);
   console.log(`wrote ${contexts.length} context entries to ${outputPath}`);
} else {
   console.log(JSON.stringify(contexts, null, 3));
}

function getOutputPath() {
   const index = Bun.argv.indexOf('--out');
   const value = index === -1 ? null : Bun.argv[index + 1];
   return value ? resolve(value) : null;
}

async function buildCrowdinSyncPlan(contexts: ContextEntry[]): Promise<CrowdinResult<CrowdinSyncPlan>> {
   const crowdinStringsResult = await listCrowdinStrings();
   if (Result.isError(crowdinStringsResult)) return new Err(crowdinStringsResult.error);

   const crowdinStrings = crowdinStringsResult.value;
   const stringsByIdentifier = new Map(crowdinStrings.flatMap((string) => (string.identifier ? [[string.identifier, string]] : [])));
   const updates: ContextUpdate[] = [];
   const missing: string[] = [];
   let matched = 0;
   let skipped = 0;

   for (const context of contexts) {
      const string = stringsByIdentifier.get(context.key);
      if (!string) {
         missing.push(context.key);
         continue;
      }

      matched += 1;

      const currentContext = string.context ?? '';
      const nextContext = buildNextContext(currentContext, context.context);
      if (!nextContext) {
         skipped += 1;
         continue;
      }

      updates.push({
         currentContext,
         key: context.key,
         nextContext,
         source: context.source,
         stringId: string.id
      });
   }

   return Result.ok({ matched, missing, skipped, updates });
}

async function listCrowdinStrings(): Promise<CrowdinResult<CrowdinString[]>> {
   const strings: CrowdinString[] = [];
   let offset = 0;
   const limit = 500;

   while (true) {
      const url = new URL(`${crowdinApiBaseUrl}/projects/${crowdinProjectId}/strings`);
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));

      const response = await crowdinFetch<CrowdinListResponse>(url, { method: 'GET' });
      if (Result.isError(response)) return new Err(response.error);

      strings.push(...response.data.map((entry) => entry.data));

      offset += response.pagination.limit;
      if (offset >= response.pagination.total) return Result.ok(strings);
   }
}

async function applyCrowdinContextUpdates(updates: ContextUpdate[]): Promise<CrowdinResult<number>> {
   for (const update of updates) {
      const url = `${crowdinApiBaseUrl}/projects/${crowdinProjectId}/strings/${update.stringId}`;
      const result = await crowdinFetch(url, {
         method: 'PATCH',
         body: JSON.stringify([
            {
               op: 'replace',
               path: '/context',
               value: update.nextContext
            }
         ])
      });

      if (Result.isError(result)) return new Err(result.error);
   }

   return Result.ok(updates.length);
}

function buildNextContext(currentContext: string, generatedContext: string) {
   const managedBlock = `${contextBlockStart}\n${generatedContext}\n${contextBlockEnd}`;
   const trimmedContext = currentContext.trim();

   if (trimmedContext === managedBlock || trimmedContext.includes(generatedContext)) return null;

   const blockStart = currentContext.indexOf(contextBlockStart);
   const blockEnd = currentContext.indexOf(contextBlockEnd);

   if (blockStart !== -1 && blockEnd !== -1 && blockEnd > blockStart) {
      const before = currentContext.slice(0, blockStart).trimEnd();
      const after = currentContext.slice(blockEnd + contextBlockEnd.length).trimStart();
      const nextContext = [before, managedBlock, after].filter(Boolean).join('\n\n');
      return nextContext === currentContext ? null : nextContext;
   }

   return trimmedContext ? `${currentContext.trimEnd()}\n\n${managedBlock}` : managedBlock;
}

async function crowdinFetch<T = unknown>(url: string | URL, init: RequestInit): Promise<CrowdinResult<T>> {
   return Result.tryPromise({
      try: async () => {
         const response = await fetch(url, {
            ...init,
            headers: {
               Authorization: `Bearer ${crowdinPersonalToken}`,
               'Content-Type': 'application/json'
            }
         });

         if (!response.ok) {
            throw new CrowdinRequestError({
               message: `Crowdin request failed with ${response.status} ${response.statusText}: ${await response.text()}`,
               status: response.status,
               cause: null
            });
         }

         if (response.status === 204) return undefined as T;
         return (await response.json()) as T;
      },
      catch: (cause) =>
         cause instanceof CrowdinRequestError
            ? cause
            : new CrowdinRequestError({
                 message: 'Crowdin request failed',
                 status: null,
                 cause
              })
   });
}

function scanSourceFiles(directory: string): string[] {
   return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return scanSourceFiles(path);
      if (!entry.isFile() || (!path.endsWith('.ts') && !path.endsWith('.tsx'))) return [];
      if (path.endsWith('routeTree.gen.ts')) return [];
      return [path];
   });
}

function scanFile(file: string) {
   const repoPath = toRepoPath(file);
   if (skippedPathParts.some((part) => repoPath.includes(part))) return [];

   const content = readFileSync(file, 'utf8');
   const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
   const translators = new Map<string, string>();
   const usages: TranslationUsage[] = [];

   visit(sourceFile);
   return usages;

   function visit(node: ts.Node) {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isCallExpression(node.initializer)) {
         const call = node.initializer;
         const namespace = call.arguments[0];

         if (ts.isIdentifier(call.expression) && call.expression.text === 'useTranslations') {
            translators.set(node.name.text, namespace && ts.isStringLiteral(namespace) ? namespace.text : '');
         }
      }

      if (ts.isCallExpression(node) && !isInsideSkippedContext(node)) {
         const translator = getTranslatorName(node.expression);
         const keyArg = node.arguments[0];

         if (translator && translators.has(translator) && ts.isStringLiteral(keyArg)) {
            const namespace = translators.get(translator);
            const key = namespace ? `${namespace}.${keyArg.text}` : keyArg.text;

            if (!isSkippedKey(key)) {
               const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
               const viewport = viewportForFile(repoPath);

               usages.push({
                  file: repoPath,
                  key,
                  line: line + 1,
                  url: buildContextUrl(repoPath, key, viewport),
                  viewport
               });
            }
         }
      }

      ts.forEachChild(node, visit);
   }
}

function getTranslatorName(expression: ts.Expression) {
   if (ts.isIdentifier(expression)) return expression.text;
   if (!ts.isPropertyAccessExpression(expression) || !ts.isIdentifier(expression.expression)) return null;

   return ['rich', 'markup', 'raw'].includes(expression.name.text) ? expression.expression.text : null;
}

function isInsideSkippedContext(node: ts.Node) {
   return isInsideSkippedJsx(node) || isInsideSkippedJsxAttribute(node) || isInsideToastCall(node);
}

function isInsideSkippedJsx(node: ts.Node) {
   let current: ts.Node | undefined = node;

   while (current) {
      const tagName = ts.isJsxElement(current)
         ? getJsxTagName(current.openingElement.tagName)
         : ts.isJsxSelfClosingElement(current)
           ? getJsxTagName(current.tagName)
           : '';
      if (tagName && shouldSkipJsxTag(tagName)) return true;
      current = current.parent;
   }

   return false;
}

function isInsideSkippedJsxAttribute(node: ts.Node) {
   let current: ts.Node | undefined = node;

   while (current) {
      if (ts.isJsxAttribute(current) && ts.isIdentifier(current.name) && skippedJsxAttributes.has(current.name.text)) return true;
      current = current.parent;
   }

   return false;
}

function isInsideToastCall(node: ts.Node) {
   let current: ts.Node | undefined = node;

   while (current) {
      if (ts.isCallExpression(current) && isToastExpression(current.expression)) return true;
      current = current.parent;
   }

   return false;
}

function isToastExpression(expression: ts.Expression) {
   if (ts.isIdentifier(expression)) return expression.text === 'toast';
   if (!ts.isPropertyAccessExpression(expression)) return false;
   if (ts.isIdentifier(expression.expression)) return expression.expression.text === 'toast';
   return isToastExpression(expression.expression);
}

function getJsxTagName(tagName: ts.JsxTagNameExpression) {
   if (ts.isIdentifier(tagName)) return tagName.text;
   if (ts.isPropertyAccessExpression(tagName)) return tagName.name.text;
   return '';
}

function shouldSkipJsxTag(tagName: string) {
   return skippedJsxNames.has(tagName) || skippedJsxPrefixes.some((prefix) => tagName.startsWith(prefix));
}

function isSkippedKey(key: string) {
   const normalized = key.toLowerCase();
   return (
      normalized.includes('dialog') ||
      normalized.includes('popover') ||
      normalized.includes('modal') ||
      normalized.includes('tooltip') ||
      normalized.includes('error') ||
      normalized.includes('failed') ||
      normalized.includes('notfound') ||
      normalized.startsWith('legal.consent.')
   );
}

function buildContextEntries(usages: TranslationUsage[]) {
   const byKey = new Map<string, TranslationUsage[]>();

   for (const usage of usages) {
      byKey.set(usage.key, [...(byKey.get(usage.key) ?? []), usage]);
   }

   return [...byKey.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, usagesForKey]): ContextEntry => {
         const source = sourceStrings.get(key) ?? '';
         const uniqueUsages = uniqueBy(usagesForKey, (usage) => `${usage.file}:${usage.line}:${usage.url}`);
         const uniqueUrls = uniqueBy(uniqueUsages, (usage) => `${usage.viewport}:${usage.url}`);
         const context = [
            'Used on:',
            ...uniqueUrls.map((usage) => `- ${usage.url}${usage.viewport === 'mobile' ? ' (mobile viewport)' : ''}`),
            '',
            'Source files:',
            ...uniqueUsages.map((usage) => `- ${usage.file}:${usage.line}`),
            '',
            `Source text: ${source}`
         ].join('\n');

         return {
            key,
            source,
            context,
            usages: uniqueUsages
         };
      });
}

function uniqueBy<T>(items: T[], getId: (item: T) => string) {
   const seen = new Set<string>();

   return items.filter((item) => {
      const id = getId(item);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
   });
}

function buildContextUrl(file: string, key: string, viewport: Viewport) {
   const url = new URL(routeForFile(file));
   url.searchParams.set(contextParam, key);
   if (viewport === 'mobile') url.searchParams.set('ssctxViewport', 'mobile');
   return url.toString();
}

function viewportForFile(file: string) {
   return file.includes('/mobile-') ? 'mobile' : 'desktop';
}

function routeForFile(file: string) {
   return routeRules.find(([parts]) => parts.some((part) => file.includes(part)))?.[1] ?? `${siteUrl}/maps?verified=true`;
}

function flattenMessages(source: Record<string, unknown>) {
   const strings = new Map<string, string>();
   walk(source, []);
   return strings;

   function walk(value: unknown, path: string[]) {
      if (typeof value === 'string') {
         strings.set(path.join('.'), value);
         return;
      }

      if (!value || typeof value !== 'object' || Array.isArray(value)) return;

      for (const [key, child] of Object.entries(value)) {
         walk(child, [...path, key]);
      }
   }
}

function toRepoPath(file: string) {
   return relative(process.cwd(), file).replaceAll('\\', '/');
}
