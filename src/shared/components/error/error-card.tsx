import type { ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface ErrorCardProps {
   icon: LucideIcon;
   title: string;
   description: string;
   meta?: ReactNode;
   actions?: ReactNode;
}

export function ErrorCard({ icon: Icon, title, description, meta, actions }: ErrorCardProps) {
   return (
      <div className="app-container pt-8">
         <Card className="m-5 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <Icon className="text-muted-foreground size-10" />
            <div>
               <h1 className="text-lg font-bold text-balance">{title}</h1>
               <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            </div>
            {meta}
            {actions && <div className="mt-2 flex flex-row gap-2">{actions}</div>}
         </Card>
      </div>
   );
}
