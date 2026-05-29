'use client';

import { useEffect, useId, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfirmDialogProps {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   title: string;
   description: string;
   confirmLabel?: string;
   pending?: boolean;
   variant?: 'default' | 'destructive';
   disabled?: boolean;
   confirmationText?: string;
   textInput?: {
      label: string;
      value: string;
      onValueChangeAction: (value: string) => void;
      placeholder?: string;
      error?: string;
      required?: boolean;
      disabled?: boolean;
      autoComplete?: string;
      type?: 'text' | 'number';
      min?: number;
      max?: number;
      step?: number | 'any';
   };
   onConfirmAction: () => void;
   children?: React.ReactNode;
}

export function ConfirmDialog({
   open,
   onOpenChangeAction,
   title,
   description,
   confirmLabel,
   pending = false,
   variant = 'default',
   disabled = false,
   confirmationText,
   textInput,
   onConfirmAction,
   children
}: ConfirmDialogProps) {
   const t = useTranslations();
   const textInputId = useId();
   const confirmationInputId = useId();
   const [confirmationValue, setConfirmationValue] = useState('');
   const resolvedConfirmLabel = confirmLabel ?? t('common.confirm');
   const needsConfirmationText = confirmationText != null && confirmationText.length > 0;
   const confirmationTextMatches = !needsConfirmationText || confirmationValue === confirmationText;
   const textInputDisabled = textInput?.disabled ?? pending;
   const textInputMissing = textInput?.required === true && textInput.value.trim().length === 0;
   const confirmDisabled = pending || disabled || !confirmationTextMatches || textInputMissing || textInput?.error != null;

   useEffect(() => {
      setConfirmationValue('');
   }, [open, confirmationText]);

   function handleConfirm() {
      if (confirmDisabled) {
         return;
      }

      onConfirmAction();
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
         <DialogContent className="h-dvh max-h-dvh max-w-none overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-lg sm:border">
            <form
               className="flex h-full min-h-0 flex-col sm:max-h-[calc(100dvh-2rem)]"
               onSubmit={(event) => {
                  event.preventDefault();
                  handleConfirm();
               }}
            >
               <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
                  <DialogHeader>
                     <DialogTitle>{title}</DialogTitle>
                     <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  {children}
                  {textInput && (
                     <div className="flex flex-col gap-1.5">
                        <Label htmlFor={textInputId}>{textInput.label}</Label>
                        <Input
                           id={textInputId}
                           type={textInput.type ?? 'text'}
                           min={textInput.min}
                           max={textInput.max}
                           step={textInput.step}
                           value={textInput.value}
                           placeholder={textInput.placeholder}
                           onChange={(event) => textInput.onValueChangeAction(event.target.value)}
                           disabled={textInputDisabled}
                           autoComplete={textInput.autoComplete ?? 'off'}
                           aria-invalid={!!textInput.error}
                        />
                        {textInput.error && <p className="text-destructive text-sm">{textInput.error}</p>}
                     </div>
                  )}
                  {needsConfirmationText && (
                     <div className="flex flex-col gap-1.5">
                        <Label htmlFor={confirmationInputId}>{t('common.typeToConfirm', { value: confirmationText })}</Label>
                        <Input
                           id={confirmationInputId}
                           value={confirmationValue}
                           onChange={(event) => setConfirmationValue(event.target.value)}
                           disabled={pending}
                           autoComplete="off"
                        />
                     </div>
                  )}
               </div>
               <DialogFooter className="bg-background border-t p-4 sm:p-6">
                  <Button type="button" variant="secondary" onClick={() => onOpenChangeAction(false)} className="cursor-pointer">
                     {t('common.cancel')}
                  </Button>
                  <Button type="submit" variant={variant} disabled={confirmDisabled} className="relative cursor-pointer">
                     <span className={pending ? 'invisible' : undefined}>{resolvedConfirmLabel}</span>
                     {pending && <Loader2 className="absolute animate-spin" />}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
