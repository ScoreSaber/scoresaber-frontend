'use client';

import { createElement, useCallback } from 'react';

import { useBlocker } from '@tanstack/react-router';

import { ConfirmDialog } from '@/shared/components/confirm-dialog';

export function DirtyNavigationBlocker({
   isDirty,
   title,
   description,
   confirmLabel
}: {
   isDirty: boolean;
   title: string;
   description: string;
   confirmLabel: string;
}) {
   const shouldBlockFn = useCallback(() => {
      return isDirty;
   }, [isDirty]);

   const blocker = useBlocker({
      shouldBlockFn,
      enableBeforeUnload: isDirty,
      disabled: !isDirty,
      withResolver: true
   });

   return createElement(ConfirmDialog, {
      open: blocker.status === 'blocked',
      onOpenChangeAction: (open) => {
         if (!open) blocker.reset?.();
      },
      title,
      description,
      confirmLabel,
      onConfirmAction: () => blocker.proceed?.()
   });
}
