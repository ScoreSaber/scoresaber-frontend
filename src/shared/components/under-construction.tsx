import { useTranslations } from 'use-intl';

import { Image } from '@/shared/components/image';
import { cn } from '@/shared/format/helpers';

interface UnderConstructionProps {
   className?: string;
   fillHeight?: boolean;
}

export function UnderConstruction({ className, fillHeight = false }: UnderConstructionProps) {
   const t = useTranslations();
   return (
      <div className={cn('flex flex-col items-center justify-center gap-4 lg:gap-6', fillHeight ? 'min-h-full flex-1' : 'py-12', className)}>
         <Image src="/scoresaber.svg" width={64} height={64} alt={t('common.scoreSaberLogo')} className="hidden w-20 lg:block" priority />
         <p className="text-muted-foreground text-lg">{t('common.underConstruction')}</p>
      </div>
   );
}
