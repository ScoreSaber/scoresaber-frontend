'use client';

import { type ComponentProps, type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { Result, type Result as CopyResult } from 'better-result';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { cn } from '@/shared/format/helpers';

type MaybePromise<T> = T | Promise<T>;
type CopyButtonSize = 'xs' | 'sm' | 'md';
type CopyButtonSource =
   | {
        value: string | (() => MaybePromise<string>);
        copyAction?: never;
     }
   | {
        value?: never;
        copyAction: () => MaybePromise<CopyResult<void, Error>>;
     };
type CopyButtonRenderState = {
   buttonProps: ComponentProps<'button'>;
   copied: boolean;
   icon: ReactNode;
   pending: boolean;
};

type CopyButtonProps = Omit<ComponentProps<'button'>, 'children' | 'onClick' | 'value'> &
   CopyButtonSource & {
      children?: (state: CopyButtonRenderState) => ReactNode;
      copiedIcon?: ReactNode;
      icon?: ReactNode;
      size?: CopyButtonSize;
      copiedDurationMs?: number;
      errorMessage?: string;
      stopPropagation?: boolean;
   };

export function CopyButton(props: CopyButtonProps) {
   const {
      children,
      icon,
      size = 'md',
      copiedDurationMs = 2000,
      errorMessage,
      stopPropagation = false,
      className,
      disabled,
      onKeyDown,
      'aria-label': ariaLabel,
      copiedIcon,
      value: _value,
      copyAction: _copyAction,
      ...buttonProps
   } = props;
   const t = useTranslations();
   const [copied, setCopied] = useState(false);
   const [pending, setPending] = useState(false);
   const copiedTimeoutRef = useRef<number | null>(null);
   const resolvedIcon = icon ?? <Copy />;
   const resolvedCopiedIcon = copiedIcon ?? <Check />;
   const disabledOrPending = disabled || pending;
   const animatedIcon = (
      <span className="grid place-items-center">
         <span
            className={cn(
               'col-start-1 row-start-1 inline-flex items-center justify-center transition-all duration-200 ease-out',
               copied ? 'scale-50 rotate-12 opacity-0' : 'scale-100 rotate-0 opacity-100'
            )}
         >
            {resolvedIcon}
         </span>
         <span
            className={cn(
               'text-primary col-start-1 row-start-1 inline-flex items-center justify-center transition-all duration-200 ease-out',
               copied ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-12 opacity-0'
            )}
         >
            {resolvedCopiedIcon}
         </span>
      </span>
   );

   useEffect(
      () => () => {
         if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
      },
      []
   );

   async function copy(event: MouseEvent<HTMLButtonElement>) {
      if (stopPropagation) event.stopPropagation();
      if (disabledOrPending) return;

      setPending(true);
      const result = await runCopyAction(props);
      setPending(false);

      Result.match(result, {
         ok: () => {
            setCopied(true);

            if (copiedTimeoutRef.current) window.clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = window.setTimeout(() => setCopied(false), copiedDurationMs);
         },
         err: () => toast.error(errorMessage ?? t('common.copyFailed'))
      });
   }

   const interactiveProps: ComponentProps<'button'> = {
      ...buttonProps,
      type: 'button',
      'aria-label': ariaLabel ?? t('common.copy'),
      disabled: disabledOrPending,
      onClick: copy,
      onKeyDown: (event) => {
         if (stopPropagation) event.stopPropagation();
         onKeyDown?.(event);
      }
   };

   if (children) {
      return children({
         buttonProps: interactiveProps,
         copied,
         icon: animatedIcon,
         pending
      });
   }

   return (
      <button
         {...interactiveProps}
         className={cn(
            'text-muted-foreground hover:text-primary focus-visible:border-ring focus-visible:ring-ring/50 inline-flex cursor-pointer items-center justify-center rounded-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
            size === 'xs' ? 'size-3 [&_svg]:size-2' : size === 'sm' ? 'size-4 [&_svg]:size-3' : 'size-6 [&_svg]:size-3.5',
            className
         )}
      >
         {animatedIcon}
      </button>
   );
}

async function runCopyAction(source: CopyButtonSource): Promise<CopyResult<void, Error>> {
   if (source.copyAction) return source.copyAction();

   const value = typeof source.value === 'function' ? await source.value() : source.value;
   return Result.tryPromise(() => navigator.clipboard.writeText(value));
}
