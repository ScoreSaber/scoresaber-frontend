'use client';

import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/shared/format/helpers';

export function StatusBadge({ value }: { value: string }) {
   if (value === 'ACTIVE') return <Badge variant="stat-success">{value}</Badge>;
   if (value === 'ARCHIVED') return <Badge variant="secondary">{value}</Badge>;
   return <Badge variant="outline">{value}</Badge>;
}

export function FormField({ id, label, children }: { id: string; label: string; children: ReactNode }) {
   return (
      <div className="flex flex-col gap-1.5">
         <Label htmlFor={id}>{label}</Label>
         {children}
      </div>
   );
}

export function LiveSection({ title, icon, actions, children }: { title: string; icon?: ReactNode; actions?: ReactNode; children: ReactNode }) {
   return (
      <section className="flex min-w-0 flex-col gap-4">
         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
               {icon}
               {title}
            </h2>
            {actions ? <div className="flex flex-wrap gap-2 sm:justify-end">{actions}</div> : null}
         </div>
         <Separator variant="fade" />
         {children}
      </section>
   );
}

export function LiveActionHeader({ label }: { label: string }) {
   return <span className="sr-only">{label}</span>;
}

export function LiveTableShell({ className, children }: { className?: string; children: ReactNode }) {
   return <div className={cn('min-h-0 overflow-y-auto rounded-md border bg-background/70 shadow-sm backdrop-blur-sm', className)}>{children}</div>;
}

export function LiveRowActions({ children }: { children: ReactNode }) {
   return (
      <div className="ml-auto flex w-max shrink-0 justify-end gap-1 opacity-100 transition-opacity md:pointer-events-none md:opacity-0 md:group-hover/row:pointer-events-auto md:group-hover/row:opacity-100 md:focus-within:pointer-events-auto md:focus-within:opacity-100">
         {children}
      </div>
   );
}

export function CheckboxRow({
   label,
   checked,
   disabled,
   onCheckedChangeAction
}: {
   label: string;
   checked: boolean;
   disabled?: boolean;
   onCheckedChangeAction: (checked: boolean) => void;
}) {
   return (
      <Label className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50">
         <Checkbox
            checked={checked}
            onCheckedChange={(value) => onCheckedChangeAction(value === true)}
            disabled={disabled}
            className="cursor-pointer"
         />
         {label}
      </Label>
   );
}
