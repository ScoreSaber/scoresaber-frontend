import { notFound } from '@tanstack/react-router';
import { Err, matchError, Ok, Result, TaggedError } from 'better-result';

class ApiNotFoundError extends TaggedError('ApiNotFoundError')<{
   message: string;
   cause: unknown;
}>() {}

class ApiRequestError extends TaggedError('ApiRequestError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

type ApiError = ApiNotFoundError | ApiRequestError;
type ApiResult<T> = Ok<T, ApiError> | Err<T, ApiError>;
type ApiResponse<T> = { data: T };
type PageDataResult<T> = { ok: true; data: T } | { ok: false; status: number | null; message: string };

export function apiResult<T>(promise: Promise<T>): Promise<ApiResult<T>> {
   return Result.tryPromise({
      try: () => promise,
      catch: toApiError
   });
}

export async function pageApiData<T>(promise: Promise<ApiResponse<T>>): Promise<PageDataResult<T>> {
   const result = await pageApi(promise);

   if (!result.ok) {
      return result;
   }

   return {
      ok: true,
      data: result.data.data
   };
}

export async function optionalApi<T>(promise: Promise<T>): Promise<T | null> {
   const result = await apiResult(promise);

   return Result.match(result, {
      ok: (value) => value,
      err: () => null
   });
}

export async function optionalApiData<T>(promise: Promise<ApiResponse<T>>): Promise<T | null> {
   const response = await optionalApi(promise);
   return response?.data ?? null;
}

export async function queryApiData<T>(promise: Promise<ApiResponse<T>>) {
   const result = await apiResult(promise);

   if (Result.isOk(result)) {
      return result.value.data;
   }

   throw result.error;
}

export function pageDataOk<T>(data: T): PageDataResult<T> {
   return { ok: true, data };
}

// page-level fetch -- returns data or error info for inline rendering
// 404 still triggers notFound() so Next.js renders the not-found page
async function pageApi<T>(promise: Promise<T>): Promise<PageDataResult<T>> {
   const result = await apiResult(promise);

   if (Result.isOk(result)) {
      return { ok: true, data: result.value };
   }

   return matchError(result.error, {
      ApiNotFoundError: () => {
         throw notFound();
      },
      ApiRequestError: (error) => ({
         ok: false,
         status: error.status,
         message: error.message
      })
   });
}

function toApiError(cause: unknown) {
   const status = getApiStatus(cause);

   if (status === 404) {
      return new ApiNotFoundError({
         message: getApiNotFoundMessage(cause),
         cause
      });
   }

   return new ApiRequestError({
      message: getApiRequestMessage(cause, status),
      status,
      cause
   });
}

function getApiStatus(cause: unknown) {
   if (typeof cause !== 'object' || cause == null || !('status' in cause)) return null;
   return typeof cause.status === 'number' ? cause.status : null;
}

function getApiNotFoundMessage(cause: unknown) {
   const message = getApiMessage(cause);
   return message === 'request failed' ? 'resource not found' : message;
}

function getApiMessage(cause: unknown) {
   if (cause instanceof Error && cause.message) return cause.message;
   if (typeof cause !== 'object' || cause == null) return 'request failed';

   if (
      'error' in cause &&
      typeof cause.error === 'object' &&
      cause.error != null &&
      'message' in cause.error &&
      typeof cause.error.message === 'string'
   ) {
      return cause.error.message;
   }

   if ('message' in cause && typeof cause.message === 'string' && cause.message) {
      return cause.message;
   }

   return 'request failed';
}

function getApiRequestMessage(cause: unknown, status: number | null) {
   const message = getApiMessage(cause);
   if (message !== 'request failed') {
      return message;
   }

   const details = [getApiUrl(cause), getApiStatusText(cause)].filter(Boolean);
   const statusLabel = status == null ? 'unknown status' : String(status);

   return details.length > 0
      ? `api request failed (${statusLabel} ${details.join(' ')}): ${message}`
      : `api request failed (${statusLabel}): ${message}`;
}

function getApiUrl(cause: unknown) {
   if (typeof cause !== 'object' || cause == null || !('url' in cause)) return null;
   return typeof cause.url === 'string' && cause.url ? cause.url : null;
}

function getApiStatusText(cause: unknown) {
   if (typeof cause !== 'object' || cause == null || !('statusText' in cause)) return null;
   return typeof cause.statusText === 'string' && cause.statusText ? cause.statusText : null;
}
