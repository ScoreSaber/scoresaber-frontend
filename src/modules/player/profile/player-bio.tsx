'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { cn } from '@/shared/format/helpers';

const collapsedBioHeight = 256;

type PlayerBioProps = {
   sanitizedBio: string;
};

export function PlayerBio({ sanitizedBio }: PlayerBioProps) {
   const t = useTranslations();
   const contentRef = useRef<HTMLDivElement>(null);
   const [expanded, setExpanded] = useState(false);
   const [canExpand, setCanExpand] = useState(false);
   const fadeStyle: CSSProperties | undefined =
      canExpand && !expanded
         ? {
              maskImage: 'linear-gradient(to bottom, black calc(100% - 3rem), transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 3rem), transparent)'
           }
         : undefined;

   useEffect(() => {
      const content = contentRef.current;
      if (!content) return;

      function updateCanExpand() {
         if (!content) return;
         setCanExpand(expanded || content.scrollHeight > collapsedBioHeight + 1);
      }

      updateCanExpand();

      const observer = new ResizeObserver(updateCanExpand);
      observer.observe(content);

      return () => observer.disconnect();
   }, [sanitizedBio, expanded]);

   return (
      <div className="relative">
         <div
            ref={contentRef}
            style={fadeStyle}
            className={cn(
               'html overflow-hidden transition-[max-height] duration-300 ease-out [&_a]:text-link [&_a]:underline [&_hr]:border-border [&_hr]:my-4 [&_iframe]:my-3 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:max-h-80 [&_iframe]:w-full [&_iframe]:max-w-xl [&_iframe]:rounded-md [&_img]:mx-auto [&_img]:my-3 [&_img]:max-h-80 [&_img]:max-w-full [&_img]:rounded-md [&_img]:object-contain [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5',
               '[&_h1]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:my-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:text-lg [&_h4]:font-semibold',
               expanded ? 'max-h-none' : 'max-h-64'
            )}
         >
            <div dangerouslySetInnerHTML={{ __html: sanitizedBio }} />
         </div>
         {canExpand && (
            <div className="pointer-events-none absolute right-1 bottom-1 flex justify-end">
               <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  aria-label={expanded ? t('player.collapseBio') : t('player.expandBio')}
                  aria-expanded={expanded}
                  onClick={() => setExpanded((value) => !value)}
                  className="pointer-events-auto rounded-full shadow-sm"
               >
                  <ChevronDown data-icon className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
               </Button>
            </div>
         )}
      </div>
   );
}
