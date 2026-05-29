'use client';

import { useState } from 'react';

import { FaSearch, FaTimes } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn } from '@/shared/format/helpers';

interface DebouncedSearchInputProps {
   id: string;
   initialValue?: string;
   placeholder?: string;
   clearLabel?: string;
   srLabel?: string;
   onSearchAction: (value: string | undefined) => void;
   debounceMs?: number;
   minLength?: number;
   className?: string;
   inputClassName?: string;
}

export function DebouncedSearchInput({
   id,
   initialValue = '',
   placeholder,
   clearLabel = 'Clear search',
   srLabel,
   onSearchAction,
   debounceMs = 400,
   minLength = 3,
   className,
   inputClassName
}: DebouncedSearchInputProps) {
   const [searchValue, setSearchValue] = useState(initialValue);
   const debouncedSearch = useDebouncedCallback((value: string) => {
      const trimmed = value.trim();
      onSearchAction(trimmed.length >= minLength ? trimmed : undefined);
   }, debounceMs);

   function handleChange(value: string) {
      setSearchValue(value);
      debouncedSearch.run(value);
   }

   return (
      <div className={cn('relative w-full', className)}>
         {srLabel && (
            <label htmlFor={id} className="sr-only">
               {srLabel}
            </label>
         )}
         <FaSearch className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" aria-hidden="true" />
         <Input
            id={id}
            type="text"
            name="search"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={cn('bg-secondary/40 focus:bg-secondary/60 pr-8 pl-9', inputClassName)}
         />
         {searchValue && (
            <Button
               type="button"
               variant="ghost"
               size="icon-xs"
               aria-label={clearLabel}
               onClick={() => handleChange('')}
               className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer"
            >
               <FaTimes aria-hidden="true" />
            </Button>
         )}
      </div>
   );
}
