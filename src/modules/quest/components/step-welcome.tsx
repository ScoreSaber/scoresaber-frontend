'use client';

import { useTranslations } from 'use-intl';

export function StepWelcome() {
   const t = useTranslations();
   return (
      <div className="flex flex-col gap-4 text-sm">
         <p>{t('quest.step.1.intro')}</p>
         <p className="text-muted-foreground">{t('quest.step.1.continueHint')}</p>
      </div>
   );
}
