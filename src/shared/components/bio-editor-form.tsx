'use client';

import { Loader2, OctagonAlert } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { RichTextEditor } from '@/shared/components/rich-text-editor';

interface BioEditorFormProps {
   value: string;
   onValueChangeAction: (value: string) => void;
   placeholder: string;
   countLabel: string;
   saveLabel: string;
   saveDisabled: boolean;
   savePending: boolean;
   onSaveAction: () => void;
   id?: string;
   disabled?: boolean;
   invalid?: boolean;
   cancelLabel?: string;
   onCancelAction?: () => void;
   error?: Error | null;
   hideActions?: boolean;
}

export function BioEditorForm({
   value,
   onValueChangeAction,
   placeholder,
   countLabel,
   saveLabel,
   saveDisabled,
   savePending,
   onSaveAction,
   id,
   disabled = false,
   invalid = false,
   cancelLabel,
   onCancelAction,
   error,
   hideActions = false
}: BioEditorFormProps) {
   return (
      <div className="flex flex-col gap-2">
         <RichTextEditor id={id} value={value} onChangeAction={onValueChangeAction} placeholder={placeholder} disabled={disabled} />
         {error && (
            <Alert variant="destructive">
               <OctagonAlert className="size-4" />
               <AlertDescription>{error.message}</AlertDescription>
            </Alert>
         )}
         {!hideActions && (
            <div className="flex items-center justify-between gap-2">
               <span className={invalid ? 'text-destructive text-xs' : 'text-muted-foreground text-xs'}>{countLabel}</span>
               <div className="flex gap-2">
                  {cancelLabel && onCancelAction && (
                     <Button type="button" variant="secondary" size="sm" onClick={onCancelAction} disabled={savePending}>
                        {cancelLabel}
                     </Button>
                  )}
                  <Button type="button" size="sm" onClick={onSaveAction} disabled={saveDisabled} className="relative cursor-pointer">
                     <span className={savePending ? 'invisible' : undefined}>{saveLabel}</span>
                     {savePending && <Loader2 className="absolute size-3.5 animate-spin" />}
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
}
