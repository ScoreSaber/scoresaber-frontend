'use client';

import { useEffect, useState } from 'react';

import { HexColorPicker } from 'react-colorful';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface PlayerProfileColorPickerProps {
   disabled?: boolean;
   id: string;
   inputLabel: string;
   label: string;
   value: string;
   onChange: (value: string) => void;
}

function parseHexColor(value: string) {
   const hex = value.trim().replace(/^#/, '');
   if (/^[0-9a-f]{3}$/i.test(hex)) {
      return `#${hex.replace(/./g, '$&$&').toLowerCase()}`;
   }
   return /^[0-9a-f]{6}$/i.test(hex) ? `#${hex.toLowerCase()}` : undefined;
}

export function PlayerProfileColorPicker({ disabled, id, inputLabel, label, value, onChange }: PlayerProfileColorPickerProps) {
   const [open, setOpen] = useState(false);
   const [draftColor, setDraftColor] = useState(value);
   const [hexInput, setHexInput] = useState(value);

   useEffect(() => {
      setDraftColor(value);
      setHexInput(value);
   }, [value]);

   function commitColor(color: string) {
      setDraftColor(color);
      setHexInput(color);
      if (color !== value) onChange(color);
   }

   function commitHexInput() {
      const color = parseHexColor(hexInput);
      if (color === undefined) {
         setHexInput(draftColor);
         return;
      }
      commitColor(color);
   }

   return (
      <Popover
         open={open}
         onOpenChange={(nextOpen) => {
            if (!nextOpen) commitHexInput();
            setOpen(nextOpen);
         }}
      >
         <PopoverTrigger asChild>
            <Button
               id={id}
               type="button"
               variant="ghost"
               size="icon-sm"
               disabled={disabled}
               aria-label={label}
               title={label}
               style={{ backgroundColor: value }}
            />
         </PopoverTrigger>
         <PopoverContent className="flex w-60 flex-col gap-3">
            <HexColorPicker
               aria-label={label}
               className="profile-color-picker"
               color={draftColor}
               onChange={(color) => {
                  setDraftColor(color);
                  setHexInput(color);
               }}
               onChangeEnd={commitColor}
            />
            <Input
               aria-label={inputLabel}
               aria-invalid={parseHexColor(hexInput) === undefined}
               autoCapitalize="none"
               autoComplete="off"
               maxLength={7}
               placeholder="#rrggbb"
               spellCheck={false}
               value={hexInput}
               onBlur={commitHexInput}
               onChange={(event) => setHexInput(event.currentTarget.value)}
               onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                     commitHexInput();
                     event.currentTarget.blur();
                  } else if (event.key === 'Escape') {
                     setDraftColor(value);
                     setHexInput(value);
                     setOpen(false);
                  }
               }}
            />
         </PopoverContent>
      </Popover>
   );
}
