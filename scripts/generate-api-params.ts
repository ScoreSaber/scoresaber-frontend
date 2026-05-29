import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const SPEC_PATH = resolve(import.meta.dir, '..', 'orbis-openapi-processed.json');
const API_PATH = resolve(import.meta.dir, '..', 'src', 'shared', 'api', 'generated', 'Api.ts');
const OUT_PATH = resolve(import.meta.dir, '..', 'src', 'shared', 'api', 'generated', 'ApiParams.ts');

interface EnumParam {
   name: string;
   values: string[];
   isArray?: boolean;
}

interface Operation {
   operationId: string;
   tag: string;
   moduleName: string;
   methodName: string;
   interfaceName: string;
   pascalName: string;
   enumParams: EnumParam[];
   responseType: 'paginated' | 'array' | 'object' | null;
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
   return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function recordEntries(value: unknown): Array<[string, JsonRecord]> {
   if (!isRecord(value)) return [];

   return Object.entries(value).filter((entry): entry is [string, JsonRecord] => isRecord(entry[1]));
}

function getRecord(value: unknown): JsonRecord | undefined {
   return isRecord(value) ? value : undefined;
}

function getString(value: unknown): string | undefined {
   return typeof value === 'string' ? value : undefined;
}

function getStringArray(value: unknown): string[] {
   return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : [];
}

function getParameters(value: unknown): JsonRecord[] {
   return Array.isArray(value) ? value.filter(isRecord) : [];
}

function readJsonRecord(path: string): JsonRecord {
   const parsed: unknown = JSON.parse(readFileSync(path, 'utf-8'));
   if (!isRecord(parsed)) {
      throw new Error(`expected object JSON at ${path}`);
   }

   return parsed;
}

function operationIdToPascal(operationId: string): string {
   return operationId
      .split('_')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('')
      .replace(/[A-Z]{2,}(?=[A-Z][a-z])|[A-Z]{2,}$/g, (m) => m[0] + m.slice(1).toLowerCase())
      .replaceAll('P' + 'p', 'PP');
}

function operationIdToScreaming(operationId: string): string {
   return operationId
      .split('_')
      .map((p) => p.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase())
      .join('_');
}

function screamingToPascal(str: string): string {
   return str
      .toLowerCase()
      .replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());
}

function tagToModuleName(tag: string): string {
   const stripped = tag.replace(/Controller$/, '');
   const words = stripped.split(/[^a-zA-Z0-9]+/).filter(Boolean);
   const pascal = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
   return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function operationIdToMethodName(operationId: string): string {
   const pascal = operationIdToPascal(operationId);
   return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function main() {
   const spec = readJsonRecord(SPEC_PATH);

   const operations: Operation[] = [];

   for (const [, methods] of recordEntries(spec.paths)) {
      for (const [method, details] of recordEntries(methods)) {
         if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;

         const operationId = getString(details.operationId);
         if (!operationId) continue;

         const tags = getStringArray(details.tags);
         const tag = tags[0];
         if (!tag) continue;

         // enum params (direct enum or array with items.enum)
         const enumParams: EnumParam[] = [];
         for (const param of getParameters(details.parameters)) {
            const name = getString(param.name);
            if (!name) continue;

            const schema = getRecord(param.schema);
            const enumValues = getStringArray(schema?.enum);
            if (enumValues.length > 0) {
               enumParams.push({ name, values: enumValues });
               continue;
            }

            const items = getRecord(schema?.items);
            const itemEnumValues = getStringArray(items?.enum);
            if (schema?.type === 'array' && itemEnumValues.length > 0) {
               enumParams.push({ name, values: itemEnumValues, isArray: true });
            }
         }

         // response shape
         const responses = getRecord(details.responses);
         const resp = getRecord(responses?.['200']) ?? getRecord(responses?.['201']);
         const content = getRecord(resp?.content);
         const jsonContent = getRecord(content?.['application/json']);
         const schema = getRecord(jsonContent?.schema);
         const props = getRecord(schema?.properties) ?? {};
         const dataProp = getRecord(props.data);
         const hasDataArray = dataProp?.type === 'array';
         const isArray = schema?.type === 'array';
         const hasResponse = hasDataArray || isArray || Object.keys(props).length > 0;

         operations.push({
            operationId,
            tag,
            moduleName: tagToModuleName(tag),
            methodName: operationIdToMethodName(operationId),
            interfaceName: operationIdToPascal(operationId) + 'Params',
            pascalName: operationIdToPascal(operationId),
            enumParams,
            responseType: hasDataArray ? 'paginated' : isArray ? 'array' : hasResponse ? 'object' : null
         });
      }
   }

   const lines: string[] = [
      '/* oxlint-disable */',
      '/**',
      ' * AUTO-GENERATED by scripts/generate-api-params.ts -- do not edit manually.',
      ' * Re-generate with: bun run api:generate',
      ' */',
      '',
      "import type * as ApiTypes from './Api';",
      "import type { Api as ApiClass } from './Api';",
      'type _ApiInstance = ApiClass<unknown>;',
      '',
      '// Helper: extract the response data type from an Api method',
      'type _R<T extends (...args: never[]) => Promise<{ data: unknown }>> = Awaited<ReturnType<T>>["data"];',
      ''
   ];

   const enumOps = operations.filter((o) => o.enumParams.length > 0);
   if (enumOps.length > 0) {
      lines.push('// ── Param enum arrays & types ────────────────────────────────────────────');
      lines.push('');

      for (const op of enumOps) {
         for (const param of op.enumParams) {
            const constName = operationIdToScreaming(op.operationId) + '_' + param.name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
            const typeName = screamingToPascal(constName);
            const apiType = `ApiTypes.${op.interfaceName}['${param.name}']`;
            const vals = param.values.map((v) => `'${v}'`).join(', ');
            // for array params the api type is T[], so we need [number] to get the element type
            const satisfiesType = param.isArray ? `NonNullable<${apiType}>[number][]` : `NonNullable<${apiType}>[]`;

            lines.push(`export const ${constName} = [${vals}] as const satisfies readonly ${satisfiesType};`);
            lines.push(`export type ${typeName} = (typeof ${constName})[number];`);
            lines.push('');
         }
      }
   }

   const responseOps = operations.filter((o) => o.responseType);
   if (responseOps.length > 0) {
      lines.push('// ── Response types ───────────────────────────────────────────────────────');
      lines.push('');

      // Collect unique modules
      const modules = [...new Set(responseOps.map((o) => o.moduleName))];
      for (const mod of modules) {
         lines.push(`type _${mod.charAt(0).toUpperCase() + mod.slice(1)} = _ApiInstance['${mod}'];`);
      }
      lines.push('');

      for (const op of responseOps) {
         const modAlias = `_${op.moduleName.charAt(0).toUpperCase() + op.moduleName.slice(1)}`;
         const responseName = `${op.pascalName}Response`;

         lines.push(`export type ${responseName} = _R<${modAlias}['${op.methodName}']>;`);

         if (op.responseType === 'paginated') {
            lines.push(`export type ${op.pascalName}DataItem = ${responseName}['data'][number];`);
         } else if (op.responseType === 'array') {
            lines.push(`export type ${op.pascalName}Item = ${responseName}[number];`);
         }

         lines.push('');
      }
   }

   writeFileSync(OUT_PATH, lines.join('\n'));
   writeFileSync(API_PATH, readFileSync(API_PATH, 'utf-8').replaceAll('P' + 'p', 'PP'));

   const enumCount = enumOps.reduce((s, o) => s + o.enumParams.length, 0);
   const responseCount = responseOps.length;
   console.log(`✔ Generated ${OUT_PATH} (${enumCount} enum params, ${responseCount} response types)`);
}

main();
