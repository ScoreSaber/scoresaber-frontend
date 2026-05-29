import { Result } from 'better-result';

import { apiResult } from './api';

// plain object that survives server function serialization
export type ActionResult<T = void> = { ok: true; value: T } | { ok: false; error: string };

type ApiResponse<T, E = unknown> = { data: T; error: E };

export async function actionResult<T>(promise: Promise<T>): Promise<ActionResult<T>> {
   const result = await apiResult(promise);

   if (Result.isOk(result)) {
      return { ok: true, value: result.value };
   }
   return actionError(result.error);
}

export async function actionApiData<T, E = unknown>(promise: Promise<ApiResponse<T, E>>): Promise<ActionResult<T>> {
   const result = await apiResult(promise);

   if (Result.isOk(result)) {
      return { ok: true, value: result.value.data };
   }
   return actionError(result.error);
}

export async function actionApiVoid<T, E = unknown>(promise: Promise<ApiResponse<T, E>>): Promise<ActionResult<void>> {
   const result = await apiResult(promise);

   if (Result.isOk(result)) {
      return { ok: true, value: undefined };
   }
   return actionError(result.error);
}

// unwrap for use in useMutation -- throws on error so react-query catches it
export function unwrapAction<T>(result: ActionResult<T>): T {
   if (!result.ok) throw new Error(result.error);
   return result.value;
}

export function actionSuccess<const T>(value: T): ActionResult<T> {
   return { ok: true, value };
}

export function actionFailure(error: string): ActionResult<never> {
   return { ok: false, error };
}

// convenience for void actions that just need ok/error
export async function actionResultVoid<T>(promise: Promise<T>): Promise<ActionResult<void>> {
   const result = await apiResult(promise);

   if (Result.isOk(result)) {
      return { ok: true, value: undefined };
   }
   return actionError(result.error);
}

function actionError(error: Error): ActionResult<never> {
   return { ok: false, error: error.message };
}
