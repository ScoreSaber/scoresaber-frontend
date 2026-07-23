export interface Messages {
   [key: string]: string | Messages;
}

export function mergeMessages(base: Messages, override: Messages): Messages {
   return Object.fromEntries(
      Object.entries(base).map(([key, value]) => {
         const replacement = override[key];
         if (typeof value === 'string') return [key, typeof replacement === 'string' && replacement.trim() ? replacement : value];
         return [key, mergeMessages(value, typeof replacement === 'string' ? {} : (replacement ?? {}))];
      })
   );
}
