import { z } from 'zod';

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const SPEC_PATH = resolve(import.meta.dir, '..', 'orbis-openapi-processed.json');
const API_PATH = resolve(import.meta.dir, '..', 'src', 'shared', 'api', 'generated', 'Api.ts');
const OUT_PATH = resolve(import.meta.dir, '..', 'src', 'shared', 'api', 'generated', 'ApiParams.ts');

const jsonObjectSchema = z.looseObject({});
const enumValuesSchema = z.array(z.string()).catch([]);
const parameterSchema = z.looseObject({
   name: z.string().optional().catch(undefined),
   schema: z
      .looseObject({
         enum: enumValuesSchema,
         items: z.looseObject({ enum: enumValuesSchema }).optional().catch(undefined),
         type: z.string().optional().catch(undefined)
      })
      .optional()
      .catch(undefined)
});
const operationSchema = z.looseObject({
   operationId: z.string().optional().catch(undefined),
   parameters: z.array(z.unknown()).catch([]),
   responses: jsonObjectSchema.optional().catch(undefined),
   tags: z.array(z.string()).catch([])
});
const responseSchema = z.looseObject({
   content: z
      .looseObject({
         'application/json': z
            .looseObject({
               schema: z
                  .looseObject({
                     properties: jsonObjectSchema.optional().catch(undefined),
                     type: z.string().optional().catch(undefined)
                  })
                  .optional()
                  .catch(undefined)
            })
            .optional()
            .catch(undefined)
      })
      .optional()
      .catch(undefined)
});
const dataPropertySchema = z.looseObject({ type: z.string().optional().catch(undefined) });

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
   const spec = jsonObjectSchema.parse(JSON.parse(readFileSync(SPEC_PATH, 'utf-8')));
   const paths = jsonObjectSchema.catch({}).parse(spec.paths);

   const operations: Operation[] = [];

   for (const rawMethods of Object.values(paths)) {
      const methods = jsonObjectSchema.safeParse(rawMethods);
      if (!methods.success) continue;

      for (const [method, rawDetails] of Object.entries(methods.data)) {
         if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) continue;

         const details = operationSchema.safeParse(rawDetails);
         if (!details.success) continue;

         const operationId = details.data.operationId;
         if (!operationId) continue;

         const tag = details.data.tags[0];
         if (!tag) continue;

         // enum params (direct enum or array with items.enum)
         const enumParams: EnumParam[] = [];
         for (const rawParam of details.data.parameters) {
            const param = parameterSchema.safeParse(rawParam);
            if (!param.success) continue;

            const name = param.data.name;
            if (!name) continue;

            const enumValues = param.data.schema?.enum ?? [];
            if (enumValues.length > 0) {
               enumParams.push({ name, values: enumValues });
               continue;
            }

            const itemEnumValues = param.data.schema?.items?.enum ?? [];
            if (param.data.schema?.type === 'array' && itemEnumValues.length > 0) {
               enumParams.push({ name, values: itemEnumValues, isArray: true });
            }
         }

         // response shape
         const responses = details.data.responses ?? {};
         const response200 = jsonObjectSchema.safeParse(responses['200']);
         const response201 = jsonObjectSchema.safeParse(responses['201']);
         const response = response200.success
            ? responseSchema.parse(response200.data)
            : response201.success
              ? responseSchema.parse(response201.data)
              : null;
         const schema = response?.content?.['application/json']?.schema;
         const properties = schema?.properties ?? {};
         const dataProperty = dataPropertySchema.safeParse(properties.data);
         const hasDataArray = dataProperty.success && dataProperty.data.type === 'array';
         const isArray = schema?.type === 'array';
         const hasResponse = hasDataArray || isArray || Object.keys(properties).length > 0;

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
