'use client';

import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { Icons } from '@/shared/components/icons';
import { cn } from '@/shared/format/helpers';

type ProviderIcon = ComponentType<HTMLAttributes<SVGElement>>;

interface LoginProviderPickerProps {
   steamHref: string;
   patreonHref: string;
   discordHref: string;
   labels: {
      steam: string;
      meta: string;
      patreon: string;
      discord: string;
   };
   steamTooltip: string;
   metaTooltip: string;
   patreonTooltip: string;
   discordTooltip: string;
   showOtherMethodsLabel: string;
   hideOtherMethodsLabel: string;
   secondaryDescription: string;
   onMetaSelect: () => void;
}

interface ProviderIconButtonProps {
   icon: ProviderIcon;
   label: string;
   href?: string;
   active?: boolean;
   disabled?: boolean;
   onClick?: () => void;
   tooltip?: string;
   usePointerCursor?: boolean;
   className?: string;
   tabIndex?: number;
}

export function LoginProviderPicker({
   steamHref,
   patreonHref,
   discordHref,
   labels,
   steamTooltip,
   metaTooltip,
   patreonTooltip,
   discordTooltip,
   showOtherMethodsLabel,
   hideOtherMethodsLabel,
   secondaryDescription,
   onMetaSelect
}: LoginProviderPickerProps) {
   const [isExpanded, setIsExpanded] = useState(false);

   return (
      <div className="relative flex h-32 flex-col items-center">
         <div className="relative h-16 w-full">
            <div
               aria-hidden={isExpanded}
               className={cn(
                  'absolute inset-0 flex translate-x-6 items-center justify-center gap-3 transition-opacity duration-200 ease-out',
                  isExpanded ? 'pointer-events-none opacity-0' : 'opacity-100'
               )}
            >
               <ProviderIconButton
                  icon={Icons.steam}
                  label={labels.steam}
                  href={steamHref}
                  tooltip={steamTooltip}
                  tabIndex={isExpanded ? -1 : undefined}
               />
               <ProviderIconButton
                  icon={Icons.meta}
                  label={labels.meta}
                  onClick={onMetaSelect}
                  tooltip={metaTooltip}
                  usePointerCursor={false}
                  tabIndex={isExpanded ? -1 : undefined}
               />
               <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={showOtherMethodsLabel}
                  aria-expanded={isExpanded}
                  onClick={() => setIsExpanded(true)}
                  tabIndex={isExpanded ? -1 : undefined}
                  className="text-muted-foreground hover:text-foreground rounded-full transition-opacity duration-200"
               >
                  <ChevronRight data-icon />
               </Button>
            </div>
            <div
               aria-hidden={!isExpanded}
               className={cn(
                  'absolute inset-0 flex translate-x-6 items-center justify-center gap-3 whitespace-nowrap transition-opacity duration-200 ease-out',
                  isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
               )}
            >
               <ProviderIconButton
                  icon={Icons.steam}
                  label={labels.steam}
                  href={steamHref}
                  tooltip={steamTooltip}
                  tabIndex={isExpanded ? undefined : -1}
               />
               <ProviderIconButton
                  icon={Icons.meta}
                  label={labels.meta}
                  onClick={onMetaSelect}
                  tooltip={metaTooltip}
                  usePointerCursor={false}
                  tabIndex={isExpanded ? undefined : -1}
               />
               <ProviderIconButton
                  icon={Icons.patreon}
                  label={labels.patreon}
                  href={patreonHref}
                  tooltip={patreonTooltip}
                  tabIndex={isExpanded ? undefined : -1}
               />
               <ProviderIconButton
                  icon={Icons.discordColor}
                  label={labels.discord}
                  href={discordHref}
                  tooltip={discordTooltip}
                  tabIndex={isExpanded ? undefined : -1}
               />
               <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={hideOtherMethodsLabel}
                  onClick={() => setIsExpanded(false)}
                  tabIndex={isExpanded ? undefined : -1}
                  className="text-muted-foreground hover:text-foreground rounded-full"
               >
                  <ChevronRight data-icon className="rotate-180" />
               </Button>
            </div>
         </div>
         <p
            aria-hidden={!isExpanded}
            className={cn(
               'text-muted-foreground/80 pointer-events-none absolute top-16 mt-3 w-72 text-xs text-pretty transition-opacity duration-200 ease-out',
               isExpanded ? 'opacity-100' : 'opacity-0'
            )}
         >
            {secondaryDescription}
         </p>
      </div>
   );
}

function ProviderIconButton({
   icon: Icon,
   label,
   href,
   active,
   disabled,
   onClick,
   tooltip,
   usePointerCursor = true,
   className,
   tabIndex
}: ProviderIconButtonProps) {
   const content = (
      <>
         <Icon className="size-7 fill-current" aria-hidden />
         <span className="sr-only">{label}</span>
      </>
   );

   const buttonClassName = cn(
      'border-border/70 bg-background/78 text-muted-foreground size-16 rounded-md border backdrop-blur-xl transition-[background-color,color,scale] active:scale-[0.96]',
      active && 'bg-accent/70 text-foreground ring-primary/35 ring-1',
      !disabled && 'hover:bg-accent/70 hover:text-foreground',
      disabled && 'hover:bg-background/78 hover:text-muted-foreground active:scale-100',
      className
   );

   function withTooltip(button: ReactNode) {
      if (!tooltip) return button;

      return (
         <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
         </Tooltip>
      );
   }

   if (!href) {
      return withTooltip(
         <Button
            variant="ghost"
            size="icon"
            disabled={disabled && !tooltip}
            aria-disabled={disabled || undefined}
            aria-pressed={onClick ? active : undefined}
            tabIndex={disabled && tooltip ? -1 : tabIndex}
            aria-label={label}
            onClick={disabled ? undefined : onClick}
            className={cn(buttonClassName, disabled ? 'cursor-default opacity-55' : usePointerCursor ? 'cursor-pointer' : 'cursor-default')}
         >
            {content}
         </Button>
      );
   }

   return withTooltip(
      <Button variant="ghost" size="icon" asChild className={cn(buttonClassName, 'cursor-pointer')}>
         <a href={href} aria-label={label} tabIndex={tabIndex}>
            {content}
         </a>
      </Button>
   );
}
