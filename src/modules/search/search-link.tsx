'use client';

import { Button } from '@/components/ui/button';

import { useOmniSearch } from '@/modules/search/search-provider';
import { cn } from '@/shared/format/helpers';

type NameSegment = { type: 'name' | 'separator'; text: string; offset: number };

// splits a credit string like "A & B (feat. C)" into name/separator segments.
// splitCommas controls whether ", " is treated as a separator (safe for mappers,
// too aggressive for song authors like "Tyler, The Creator")
function parseNames(input: string, splitCommas: boolean) {
   const pattern = splitCommas ? /(,\s+|\s+&\s+|\s+vs\.\s+|\s+feat\.\s+|\s+[xX]\s+)/ : /(\s+&\s+|\s+vs\.\s+|\s+feat\.\s+|\s+[xX]\s+)/;

   const toSegments = (text: string, offset = 0): NameSegment[] => {
      let cursor = 0;
      return text.split(pattern).flatMap((part, i): NameSegment[] => {
         const partOffset = cursor;
         cursor += part.length;
         return part ? [{ type: i % 2 === 0 ? 'name' : 'separator', text: part, offset: offset + partOffset }] : [];
      });
   };

   // pull off a trailing "(feat. ...)" if present
   const featMatch = input.match(/\s*\(feat\.\s+(.+?)\)\s*$/i);
   const featOffset = featMatch?.index ?? input.length;
   const main = input.slice(0, featOffset);
   const segments = toSegments(main);

   if (featMatch) {
      segments.push({ type: 'separator', text: ' (feat. ', offset: featOffset }, ...toSegments(featMatch[1], featOffset + ' (feat. '.length), {
         type: 'separator',
         text: ')',
         offset: input.length - 1
      });
   }

   return segments;
}

// clickable text that opens omni search pre-filled with the given query
function SearchLink({ query, children, className }: { query: string; children: React.ReactNode; className?: string }) {
   const { openWithQuery } = useOmniSearch();

   return (
      <Button
         type="button"
         variant="link"
         size={undefined}
         onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openWithQuery(query);
         }}
         className={cn('text-foreground inline h-auto cursor-pointer p-0 font-semibold transition-colors hover:no-underline', className)}
      >
         {children}
      </Button>
   );
}

// parses a credit string and renders individual SearchLinks for each name.
// splitCommas: also split on ", " -- use for mapper names, not song authors
export function LinkedNames({
   name,
   splitCommas = false,
   className,
   linkClassName
}: {
   name: string;
   splitCommas?: boolean;
   className?: string;
   linkClassName?: string;
}) {
   const segments = parseNames(name, splitCommas);

   // single name, no separators
   if (segments.length === 1 && segments[0].type === 'name') {
      return (
         <SearchLink query={segments[0].text} className={cn(className, linkClassName)}>
            {segments[0].text}
         </SearchLink>
      );
   }

   return (
      <span className={className}>
         {segments.map((seg) =>
            seg.type === 'name' ? (
               <SearchLink key={`${seg.type}-${seg.offset}-${seg.text}`} query={seg.text} className={linkClassName}>
                  {seg.text}
               </SearchLink>
            ) : (
               <span key={`${seg.type}-${seg.offset}-${seg.text}`}>{seg.text}</span>
            )
         )}
      </span>
   );
}
