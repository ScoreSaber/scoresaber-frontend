import { notFound } from '@tanstack/react-router';
import { Result } from 'better-result';
import { z } from 'zod';

import { PLAYER_CONTROLLER_GET_PLAYER_SCORES_SORT } from '@/shared/api/generated/ApiParams';

export const isNumber = z.preprocess((val) => {
   if (typeof val === 'string' && val.trim() === '') return undefined;
   return val;
}, z.coerce.number());

export const isPageNumber = z
   .preprocess((val) => {
      if (val == null || (typeof val === 'string' && val.trim() === '')) return 1;
      return val;
   }, z.coerce.number().int())
   .transform((n) => Math.max(1, n));

export const isPlayerId = z.preprocess((val) => {
   const result = Result.try(() => BigInt(String(val)));

   return Result.match(result, {
      ok: (playerId) => playerId,
      err: () => val
   });
}, z.bigint());

// mirrors backend vanity rules: 3-32 chars, [a-z0-9-], no edge hyphens, must contain a letter
export const isVanitySlug = z.string().regex(/^(?=.*[a-z])[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/);

export function toInt64PathParam(value: string | number | bigint): string {
   const result = isPlayerId.safeParse(value);
   if (!result.success) {
      throw new Error('invalid int64 path param');
   }

   return result.data.toString();
}

export const ScoreEnum = z.enum(PLAYER_CONTROLLER_GET_PLAYER_SCORES_SORT);

export function validateRequest<Output>(schema: z.ZodType<Output>, request: unknown) {
   const result = schema.safeParse(request);
   if (result.success) {
      return result.data;
   }
   throw notFound();
}
