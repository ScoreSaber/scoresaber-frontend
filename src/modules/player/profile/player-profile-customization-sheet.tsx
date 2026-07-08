'use client';

import type { ReactNode } from 'react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface PlayerProfileCustomizationSheetTab<Tab extends string> {
   value: Tab;
   label: ReactNode;
   body: ReactNode;
   disabled?: boolean;
}

interface PlayerProfileCustomizationSheetProps<Tab extends string> {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   activeTab: Tab;
   onActiveTabChange: (tab: Tab) => void;
   title: ReactNode;
   description: ReactNode;
   tabs: PlayerProfileCustomizationSheetTab<Tab>[];
   footer?: ReactNode;
}

export function PlayerProfileCustomizationSheet<Tab extends string>({
   open,
   onOpenChange,
   activeTab,
   onActiveTabChange,
   title,
   description,
   tabs,
   footer
}: PlayerProfileCustomizationSheetProps<Tab>) {
   function changeActiveTab(value: string) {
      const tab = tabs.find((tab) => tab.value === value);
      if (tab) onActiveTabChange(tab.value);
   }

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent className="w-[92vw] gap-0 overflow-hidden p-0 sm:max-w-lg">
            <SheetHeader className="shrink-0 px-5 pt-5 pb-0">
               <SheetTitle>{title}</SheetTitle>
               <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            <Tabs value={activeTab} onValueChange={changeActiveTab} className="min-h-0 flex-1 gap-0">
               <div className="shrink-0 px-5 pt-4">
                  <TabsList variant="compact-pill" className="justify-start overflow-x-auto">
                     {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled} className="px-3">
                           {tab.label}
                        </TabsTrigger>
                     ))}
                  </TabsList>
               </div>
               {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="flex min-h-0 flex-col data-[state=inactive]:hidden">
                     {tab.body}
                  </TabsContent>
               ))}
            </Tabs>
            {footer}
         </SheetContent>
      </Sheet>
   );
}
