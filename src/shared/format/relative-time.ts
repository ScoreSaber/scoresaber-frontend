const SHORT_RELATIVE_TIME_LANGUAGES = ['fr', 'ru'];

export function createRelativeTimeFormatters(locale: string, numeric: 'always' | 'auto' = 'always') {
   const shortStyle: Intl.RelativeTimeFormatStyle = SHORT_RELATIVE_TIME_LANGUAGES.includes(locale.split('-')[0].toLowerCase()) ? 'short' : 'narrow';

   return {
      relativeLong: new Intl.RelativeTimeFormat(locale, { numeric, style: 'long' }),
      relativeShort: new Intl.RelativeTimeFormat(locale, { numeric, style: shortStyle })
   };
}
