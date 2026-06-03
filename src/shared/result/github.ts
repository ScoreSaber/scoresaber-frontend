import '@tanstack/react-start/server-only';

import { Result } from 'better-result';
import * as z from 'zod';

type GithubJsonErrorInput = {
   message: string;
   status: number | null;
   cause: unknown;
};

type GithubJsonErrorFactory<E> = (input: GithubJsonErrorInput) => E;

function githubHeaders() {
   const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
   };

   if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
   }

   return headers;
}

export function fetchGithubJson<T, E>(url: string, schema: z.ZodType<T>, toError: GithubJsonErrorFactory<E>, label: string) {
   return Result.gen(async function* () {
      const response = yield* Result.await(
         Result.tryPromise({
            try: () => fetch(url, { headers: githubHeaders() }),
            catch: (cause) =>
               toError({
                  message: `${label} failed`,
                  status: null,
                  cause
               })
         })
      );

      if (!response.ok) {
         return Result.err(
            toError({
               message: `${label} failed: ${response.status}`,
               status: response.status,
               cause: null
            })
         );
      }

      const raw = yield* Result.await(
         Result.tryPromise({
            try: () => response.json(),
            catch: (cause) =>
               toError({
                  message: `${label} response parse failed`,
                  status: response.status,
                  cause
               })
         })
      );

      const parsed = schema.safeParse(raw);
      if (!parsed.success) {
         return Result.err(
            toError({
               message: parsed.error.message,
               status: response.status,
               cause: parsed.error
            })
         );
      }

      return Result.ok(parsed.data);
   });
}

export type { GithubJsonErrorInput };
