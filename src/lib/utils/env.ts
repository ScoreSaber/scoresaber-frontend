function getEnv(name: string, defaultValue = ''): string {
   const fromImportMeta = (
      typeof import.meta !== 'undefined' ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env : undefined
   )?.[name];
   if (fromImportMeta != null && fromImportMeta !== '') return fromImportMeta;

   const fromProcess = typeof process !== 'undefined' && process.versions?.node != null ? process.env?.[name] : undefined;
   if (fromProcess != null && fromProcess !== '') return fromProcess;

   return defaultValue;
}

export const CDN_URL: string = getEnv('PUBLIC_CDN_URL', 'https://cdn.scoresaber.com');
export const API_URL: string = getEnv('PUBLIC_API_URL', 'https://scoresaber.com');
