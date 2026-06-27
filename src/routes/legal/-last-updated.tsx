import { useLocale, useTranslations } from 'use-intl';

const LEGAL_LAST_UPDATED_DATE = new Date(Date.UTC(2026, 4, 30));
const LEGAL_LAST_UPDATED_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
   year: 'numeric',
   month: 'long',
   day: 'numeric',
   timeZone: 'UTC'
};

export function LegalLastUpdated() {
   const t = useTranslations('legal');
   const locale = useLocale();
   const date = new Intl.DateTimeFormat(locale, LEGAL_LAST_UPDATED_FORMAT_OPTIONS).format(LEGAL_LAST_UPDATED_DATE);

   return <p className="text-muted-foreground text-xs tracking-wide uppercase">{t('lastUpdated', { date })}</p>;
}
