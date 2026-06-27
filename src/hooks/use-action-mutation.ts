'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';

import type { ActionResult } from '@/shared/result/action';
import { unwrapAction } from '@/shared/result/action';

// shared hook for server action mutations with router.refresh + toast feedback
function useActionMutation<T = unknown>() {
   const router = useRouter();
   const [pendingKey, setPendingKey] = useState<string | null>(null);
   const mutation = useMutation<T, Error, () => Promise<ActionResult<T>>>({
      mutationFn: async (fn) => unwrapAction(await fn()),
      onSuccess: () => router.invalidate()
   });

   function run(fn: () => Promise<ActionResult<T>>, successLabel: string, errorLabel: string, onSuccess?: (value: T) => void) {
      runKeyed(null, fn, successLabel, errorLabel, onSuccess);
   }

   function runKeyed(
      key: string | null,
      fn: () => Promise<ActionResult<T>>,
      successLabel: string,
      errorLabel: string,
      onSuccess?: (value: T) => void
   ) {
      mutateKeyed(key, fn, {
         onSuccess: (value) => {
            toast.success(successLabel);
            onSuccess?.(value);
         },
         onError: () => toast.error(errorLabel)
      });
   }

   function mutateKeyed(key: string | null, fn: () => Promise<ActionResult<T>>, options?: Parameters<typeof mutation.mutate>[1]) {
      setPendingKey(key);
      mutation.mutate(fn, {
         ...options,
         onSettled: (...args) => {
            setPendingKey(null);
            options?.onSettled?.(...args);
         }
      });
   }

   function isPendingKey(key: string) {
      return mutation.isPending && pendingKey === key;
   }

   return { ...mutation, pendingKey, isPendingKey, run, runKeyed, mutateKeyed };
}

export { useActionMutation };
