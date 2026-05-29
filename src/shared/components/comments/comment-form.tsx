'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { Result } from 'better-result';
import { ChevronDown, Loader2, OctagonAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { cn } from '@/shared/format/helpers';
import type { ActionResult } from '@/shared/result/action';
import { readStorageValue, writeStorageValue } from '@/shared/result/storage';

interface CommentFormAction {
   key: string;
   dropdownLabel: string;
   submitLabel: string;
   textareaClassName?: string;
   placeholder?: string;
   onSubmit: (content: string) => Promise<ActionResult>;
}

interface CommentFormProps {
   avatar: ReactNode;
   actions: CommentFormAction[];
   storageKey?: string;
   placeholder?: string;
   maxLength?: number;
}

export function CommentForm({ avatar, actions, storageKey, placeholder, maxLength = 4096 }: CommentFormProps) {
   const t = useTranslations();
   const tc = useTranslations();
   const [value, setValue] = useState('');
   const [activeKey, setActiveKey] = useState<string>(actions[0]?.key ?? '');
   const [expanded, setExpanded] = useState(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   useEffect(() => {
      if (actions.length === 0) return;

      if (storageKey) {
         const raw = Result.unwrapOr(readStorageValue(storageKey), null);
         const stored = raw && actions.some((a) => a.key === raw) ? raw : null;

         if (stored) {
            setActiveKey(stored);
            return;
         }
      }

      if (actions.some((a) => a.key === activeKey)) return;

      const fallback = actions[0].key;
      setActiveKey(fallback);

      if (storageKey) {
         writeStorageValue(storageKey, fallback);
      }
   }, [actions, activeKey, storageKey]);

   function handleActionChange(key: string) {
      setActiveKey(key);
      if (storageKey) writeStorageValue(storageKey, key);
   }

   const activeAction = actions.find((a) => a.key === activeKey) ?? actions[0];

   const mutation = useActionMutation();

   function handleSubmit() {
      const trimmed = value.trim();
      if (!trimmed || trimmed.length > maxLength) return;
      mutation.mutate(() => activeAction.onSubmit(trimmed), {
         onSuccess: () => {
            toast.success(t('comments.commentPosted'));
            setValue('');
            setExpanded(false);
         }
      });
   }

   if (actions.length === 0 || !activeAction) return null;

   const effectivePlaceholder = activeAction.placeholder ?? placeholder ?? t('comments.postReply');
   const switchableActions = actions.filter((action) => action.key !== activeAction.key);
   const hasSwitchableActions = switchableActions.length > 0;

   if (!expanded) {
      return (
         <div className="flex items-start gap-3">
            {avatar}
            <Button
               type="button"
               variant="ghost"
               className="text-muted-foreground hover:text-muted-foreground h-8 min-w-0 flex-1 cursor-text justify-start px-0 text-left text-sm hover:bg-transparent active:!scale-100 dark:hover:bg-transparent"
               onClick={() => {
                  setExpanded(true);
                  setTimeout(() => textareaRef.current?.focus(), 0);
               }}
            >
               {effectivePlaceholder}
            </Button>
            <Button
               size="sm"
               disabled
               className="hover:bg-primary hover:text-primary-foreground shrink-0 cursor-pointer rounded-full px-4 text-xs opacity-50"
            >
               {activeAction.submitLabel}
            </Button>
         </div>
      );
   }

   return (
      <div className="flex items-start gap-3">
         {avatar}
         <div className="min-w-0 flex-1">
            <Textarea
               ref={textareaRef}
               placeholder={effectivePlaceholder}
               value={value}
               onChange={(e) => setValue(e.target.value)}
               rows={3}
               maxLength={maxLength}
               size="sm"
               resize="none"
               className={cn('border-border/50 bg-transparent', activeAction.textareaClassName)}
            />
            {mutation.error && (
               <Alert variant="destructive" className="mt-2">
                  <OctagonAlert className="size-4" />
                  <AlertDescription>{mutation.error.message}</AlertDescription>
               </Alert>
            )}
            <div className="mt-2 flex items-center justify-between">
               <span className="text-muted-foreground text-xs">{t('comments.charCount', { count: value.length, max: maxLength })}</span>
               <div className="flex items-center gap-1.5">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        setExpanded(false);
                        setValue('');
                        mutation.reset();
                     }}
                     className="text-muted-foreground text-xs"
                  >
                     {tc('common.cancel')}
                  </Button>

                  {hasSwitchableActions ? (
                     <div className="inline-flex items-center overflow-hidden rounded-full">
                        <Button
                           size="sm"
                           onClick={handleSubmit}
                           disabled={mutation.isPending || value.trim().length === 0}
                           className="relative cursor-pointer rounded-l-full rounded-r-none px-4 text-xs"
                        >
                           <span className={mutation.isPending ? 'invisible' : undefined}>{activeAction.submitLabel}</span>
                           {mutation.isPending && <Loader2 className="absolute size-3.5 animate-spin" />}
                        </Button>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button size="sm" className="rounded-l-none rounded-r-full border-l border-l-white/20 px-1.5">
                                 <ChevronDown data-icon="inline-end" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              {switchableActions.map((action) => (
                                 <DropdownMenuItem key={action.key} onClick={() => handleActionChange(action.key)} className="text-xs">
                                    {action.dropdownLabel}
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                  ) : (
                     <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={mutation.isPending || value.trim().length === 0}
                        className="relative cursor-pointer rounded-full px-4 text-xs"
                     >
                        <span className={mutation.isPending ? 'invisible' : undefined}>{activeAction.submitLabel}</span>
                        {mutation.isPending && <Loader2 className="absolute size-3.5 animate-spin" />}
                     </Button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
export type { CommentFormAction };
