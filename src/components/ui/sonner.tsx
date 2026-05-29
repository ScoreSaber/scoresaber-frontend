'use client';

import type { CSSProperties } from 'react';

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '@/shared/ui-adjacent/theme-provider';

const toasterStyle: CSSProperties & {
   '--normal-bg': string;
   '--normal-text': string;
   '--normal-border': string;
   '--border-radius': string;
} = {
   '--normal-bg': 'var(--popover)',
   '--normal-text': 'var(--popover-foreground)',
   '--normal-border': 'var(--border)',
   '--border-radius': 'var(--radius)'
};

function Toaster({ ...props }: ToasterProps) {
   const { theme = 'system' } = useTheme();

   return (
      <Sonner
         theme={theme}
         className="toaster group"
         icons={{
            success: <CircleCheckIcon className="size-4" />,
            info: <InfoIcon className="size-4" />,
            warning: <TriangleAlertIcon className="size-4" />,
            error: <OctagonXIcon className="size-4" />,
            loading: <Loader2Icon className="size-4 animate-spin" />
         }}
         style={toasterStyle}
         {...props}
      />
   );
}

export { Toaster };
