'use client';

import { useTranslations } from 'use-intl';

import { Image } from '@/shared/components/image';

export function StepInstall() {
   const t = useTranslations();
   return (
      <div className="flex flex-col gap-4 text-sm">
         <p>
            {t.rich('quest.step.4.intro', {
               mbf: (chunks) => (
                  <a href="https://mbf.bsquest.xyz/" target="_blank" rel="noreferrer noopener" className="text-primary hover:underline">
                     {chunks}
                  </a>
               )
            })}
         </p>

         <p>{t('quest.step.4.connect')}</p>
         <figure className="overflow-hidden rounded-lg border">
            <Image
               src="/images/quest/mbf/start.png"
               alt={t('quest.step.4.startScreenAlt')}
               width={1024}
               height={576}
               className="h-auto w-full"
               unoptimized
            />
         </figure>

         <p>
            {t.rich('quest.step.4.addMods', {
               b: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>
            })}
         </p>
         <figure className="overflow-hidden rounded-lg border">
            <Image
               src="/images/quest/mbf/mods.png"
               alt={t('quest.step.4.modsScreenAlt')}
               width={1024}
               height={576}
               className="h-auto w-full"
               unoptimized
            />
         </figure>

         <p>
            {t.rich('quest.step.4.upload', {
               b: (chunks) => <strong className="text-foreground font-semibold">{chunks}</strong>
            })}
         </p>
         <p>{t('quest.step.4.finish')}</p>
      </div>
   );
}
