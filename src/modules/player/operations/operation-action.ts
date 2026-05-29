import type { ActionResult } from '@/shared/result/action';

interface OperationAction {
   isPending: boolean;
   run(fn: () => Promise<ActionResult>, successLabel: string, errorLabel: string, onSuccess?: () => void): void;
}

export type { OperationAction };
