'use client';

import { useCallback, useEffect, useState, type MouseEvent } from 'react';

import { useRouter } from '@tanstack/react-router';
import { CornerDownLeft } from 'lucide-react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Icons } from '@/shared/components/icons';
import { generateNavigationOptions } from '@/shared/components/pagination-options';
import { cn, formatNumber } from '@/shared/format/helpers';
import { useRouteHrefPreload } from '@/shared/url-state/use-route-href-preload';

type PaginationProps = {
   totalItems: number;
   pageSize: number;
   currentPage: number;
   limit?: number;
   anchor?: string;
   scroll?: boolean;
   getPageHref: (page: number) => string;
};

export function Pagination({ totalItems, pageSize, currentPage, anchor, scroll = true, getPageHref: getBasePageHref }: PaginationProps) {
   const router = useRouter();
   const { schedulePreload, preloadNow, cancelPreload } = useRouteHrefPreload();
   const getPageHref = useCallback(
      (page: number) => {
         const path = getBasePageHref(page);
         return anchor ? `${path}#${anchor}` : path;
      },
      [getBasePageHref, anchor]
   );
   const totalPages = Math.ceil(totalItems / pageSize);
   const [pendingPage, setPendingPage] = useState<{ value: number | undefined; type: string } | null>(null);

   const isLoading = pendingPage !== null && pendingPage.value !== currentPage;

   useEffect(() => {
      if (pendingPage?.value === currentPage) setPendingPage(null);
   }, [pendingPage?.value, currentPage]);

   const options = generateNavigationOptions({ totalItems, pageSize, currentPage, limit: 1, showStepOptions: true });

   if (totalPages <= 1) return null;

   return (
      <div className="flex flex-row items-center gap-1">
         {options.map((option) => {
            if (option.type === 'symbol' && option.symbol === 'ELLIPSIS') {
               return (
                  <EllipsisPageJump
                     key={`ellipsis-${option.value}`}
                     totalPages={totalPages}
                     onNavigate={(page) => {
                        setPendingPage({ value: page, type: 'number' });
                        router.navigate({ href: getPageHref(page), resetScroll: scroll });
                     }}
                  />
               );
            }

            const key = option.type === 'number' ? `num-${option.value}` : `sym-${option.symbol}`;
            const atBounds =
               option.type === 'symbol' &&
               ((option.symbol === 'NEXT_PAGE' && currentPage >= totalPages) || (option.symbol === 'PREVIOUS_PAGE' && currentPage <= 1));
            const disabled = isLoading || atBounds;
            const label = option.type === 'number' ? formatNumber(option.value!) : option.symbol === 'PREVIOUS_PAGE' ? '<' : '>';
            const active = option.type === 'number' && option.value === currentPage;
            const loading = isLoading && pendingPage?.value === option.value && pendingPage?.type === option.type;
            const href = getPageHref(option.value!);

            function handleClick(event: MouseEvent<HTMLAnchorElement>) {
               if (disabled) {
                  event.preventDefault();
                  return;
               }

               if (!isRouterClick(event)) return;

               event.preventDefault();
               setPendingPage({ value: option.value, type: option.type });
               void router.navigate({ href, resetScroll: scroll });
            }

            return (
               <a
                  key={key}
                  href={href}
                  onClick={handleClick}
                  onMouseEnter={() => !disabled && schedulePreload(href)}
                  onFocus={() => !disabled && schedulePreload(href)}
                  onMouseLeave={cancelPreload}
                  onBlur={cancelPreload}
                  onTouchStart={() => !disabled && preloadNow(href)}
                  className={disabled ? 'pointer-events-none' : ''}
               >
                  <Button
                     disabled={disabled}
                     variant="secondary"
                     className={cn('min-w-8 cursor-pointer items-center border p-1', active && 'border-primary/85 bg-card')}
                  >
                     {loading ? <Icons.spinner data-icon className="size-4 animate-spin" /> : label}
                  </Button>
               </a>
            );
         })}
      </div>
   );
}

export function PaginationArrow({ direction, page, disabled, getPageHref }: PaginationArrowProps) {
   const router = useRouter();
   const { schedulePreload, preloadNow, cancelPreload } = useRouteHrefPreload();
   const [pendingHref, setPendingHref] = useState<string | null>(null);
   const href = getPageHref(page);
   const Icon = direction === 'left' ? FaArrowLeft : FaArrowRight;
   const loading = pendingHref === href;
   const buttonDisabled = disabled || loading;

   useEffect(() => {
      if (pendingHref !== null && (pendingHref !== href || disabled)) setPendingHref(null);
   }, [disabled, href, pendingHref]);

   if (buttonDisabled) {
      return (
         <Button variant="secondary" size="icon" disabled className="cursor-pointer">
            {loading ? <Icons.spinner data-icon className="size-4 animate-spin" /> : <Icon data-icon />}
         </Button>
      );
   }

   return (
      <a
         href={href}
         onClick={(event) => {
            if (!isRouterClick(event)) return;
            event.preventDefault();
            setPendingHref(href);
            void router.navigate({ href, resetScroll: true });
         }}
         onMouseEnter={() => schedulePreload(href)}
         onFocus={() => schedulePreload(href)}
         onMouseLeave={cancelPreload}
         onBlur={cancelPreload}
         onTouchStart={() => preloadNow(href)}
         className={loading ? 'pointer-events-none' : ''}
      >
         <Button variant="secondary" size="icon" className="cursor-pointer">
            {loading ? <Icons.spinner data-icon className="size-4 animate-spin" /> : <Icon data-icon />}
         </Button>
      </a>
   );
}

export function PaginationArrows({ currentPage, totalPages, getPageHref }: PaginationArrowsProps) {
   return (
      <div className="flex items-center justify-between">
         <PaginationArrow direction="left" page={currentPage - 1} disabled={currentPage <= 1} getPageHref={getPageHref} />
         <PaginationArrow direction="right" page={currentPage + 1} disabled={currentPage >= totalPages} getPageHref={getPageHref} />
      </div>
   );
}

function EllipsisPageJump({ totalPages, onNavigate }: { totalPages: number; onNavigate: (page: number) => void }) {
   const t = useTranslations();
   const [isOpen, setIsOpen] = useState(false);
   const [input, setInput] = useState('');

   function handleSubmit() {
      const page = Math.min(Math.max(1, parseInt(input.replaceAll(',', ''), 10) || 1), totalPages);
      setIsOpen(false);
      setInput('');
      onNavigate(page);
   }

   return (
      <Popover
         open={isOpen}
         onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setInput('');
         }}
      >
         <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground" aria-label={t('common.goToPage')}>
               &hellip;
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-2" sideOffset={8}>
            <div className="flex items-center gap-1.5">
               <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="h-8 w-20 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder={`1-${formatNumber(totalPages)}`}
                  autoFocus
               />
               <Button variant="secondary" size="icon-sm" onClick={handleSubmit} aria-label={t('common.goToPage')} className="cursor-pointer">
                  <CornerDownLeft data-icon />
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   );
}

type PaginationArrowProps = {
   direction: 'left' | 'right';
   page: number;
   disabled: boolean;
   getPageHref: (page: number) => string;
};

type PaginationArrowsProps = {
   currentPage: number;
   totalPages: number;
   getPageHref: (page: number) => string;
};

function isRouterClick(event: MouseEvent<HTMLAnchorElement>) {
   const target = event.currentTarget.getAttribute('target');
   return (
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      (!target || target === '_self')
   );
}
