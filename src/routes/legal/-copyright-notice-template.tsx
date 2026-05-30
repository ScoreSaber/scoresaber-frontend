'use client';

import { Result, TaggedError } from 'better-result';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

class NoticeTemplateCopyError extends TaggedError('NoticeTemplateCopyError')<{
   message: string;
   cause: unknown;
}>() {}

const noticeTemplateFields = [
   {
      label: 'Subject',
      placeholder: 'Copyright takedown notice'
   },
   {
      label: 'Copyright owner or exclusive licensee',
      placeholder: '[name]'
   },
   {
      label: 'Your authority',
      placeholder: '[owner, exclusive licensee, or authorised agent; if agent, identify who authorised you]'
   },
   {
      label: 'Copyright work',
      placeholder: '[title, description, source URL, or representative list]'
   },
   {
      label: 'ScoreSaber material, link, or reference to review',
      placeholder: '[ScoreSaber URL, image URL, map ID, leaderboard ID, BeatSaver URL, or other locator]'
   },
   {
      label: 'Contact information',
      placeholder: '[mailing address, phone number, email address]'
   },
   {
      label: 'Good faith statement',
      placeholder:
         'I believe in good faith that the disputed storage, display, link, or reference is not authorised by the copyright owner, ' +
         'an exclusive licensee, an agent, or the law.'
   },
   {
      label: 'Accuracy statement',
      placeholder: 'I have taken reasonable steps to ensure that the information and statements in this notice are accurate.'
   },
   {
      label: 'Signature',
      placeholder: '[typed full legal name or electronic signature]'
   }
] as const;

const noticeTemplateHtml = `
<ul>
${noticeTemplateFields.map((field) => `<li><strong>${field.label}:</strong> ${field.placeholder}</li>`).join('')}
</ul>
`.trim();

const noticeTemplateText = noticeTemplateFields.map((field) => `- ${field.label}:\n  ${field.placeholder}`).join('\n');

async function writeNoticeTemplate() {
   if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const html = new Blob([noticeTemplateHtml], { type: 'text/html' });
      const text = new Blob([noticeTemplateText], { type: 'text/plain' });

      return navigator.clipboard.write([
         new ClipboardItem({
            'text/html': html,
            'text/plain': text
         })
      ]);
   }

   if (!navigator.clipboard?.writeText) {
      return Promise.reject(new Error('clipboard unavailable'));
   }

   return navigator.clipboard.writeText(noticeTemplateText);
}

export function CopyrightNoticeTemplate() {
   async function handleCopy() {
      const result = await Result.tryPromise({
         try: writeNoticeTemplate,
         catch: (cause) =>
            new NoticeTemplateCopyError({
               message: 'failed to copy copyright notice template',
               cause
            })
      });

      Result.match(result, {
         ok: () => toast.success('Copied'),
         err: () => toast.error('Copy failed')
      });
   }

   return (
      <div className="space-y-3">
         <div className="flex justify-end print:hidden">
            <Button type="button" variant="ghost" size="sm" className="cursor-pointer" onClick={handleCopy}>
               <Copy data-icon />
               Copy
            </Button>
         </div>

         <ul aria-label="Copyright takedown notice template">
            {noticeTemplateFields.map((field) => (
               <li key={field.label}>
                  <strong>{field.label}:</strong> {field.placeholder}
               </li>
            ))}
         </ul>
      </div>
   );
}
