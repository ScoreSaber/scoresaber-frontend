import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/format/helpers';

const textareaVariants = cva('', {
   variants: {
      size: {
         default: 'text-base md:text-sm',
         sm: 'text-sm'
      },
      resize: {
         default: '',
         none: 'resize-none'
      }
   },
   defaultVariants: {
      size: 'default',
      resize: 'default'
   }
});

function Textarea({ className, size, resize, ...props }: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
   return (
      <textarea
         data-slot="textarea"
         className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            textareaVariants({ size, resize }),
            className
         )}
         {...props}
      />
   );
}

export { Textarea, textareaVariants };
