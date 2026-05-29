import en from '../../messages/en.json';

declare module 'use-intl' {
   interface AppConfig {
      Messages: typeof en;
   }
}
