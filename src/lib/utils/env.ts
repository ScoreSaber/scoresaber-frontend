function getEnv(name: string, defaultValue = ''): string {
   if (typeof process !== 'undefined' && process.env) {
      const value = process.env[name];
      if (value != null && value !== '') return value;
   }

   if (typeof import.meta !== 'undefined' && import.meta.env) {
      const value = (import.meta.env as Record<string, string | undefined>)[name];
      if (value != null && value !== '') return value;
   }

   return defaultValue;
}

export const CDN_URL: string = getEnv('PUBLIC_CDN_URL', 'https://cdn.scoresaber.com');
export const API_URL: string = getEnv('PUBLIC_API_URL', 'https://scoresaber.com');
