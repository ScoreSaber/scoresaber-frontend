'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface BackgroundConfig {
   src: string;
   candidates?: string[];
   invertImage?: boolean;
   reducedBlur?: boolean;
}

const PageBackgroundContext = createContext<{
   config: BackgroundConfig | null;
   set: (config: BackgroundConfig | null) => void;
}>({ config: null, set: () => {} });

export function PageBackgroundProvider({ children }: { children: React.ReactNode }) {
   const [config, setConfig] = useState<BackgroundConfig | null>(null);
   const value = useMemo(() => ({ config, set: setConfig }), [config]);
   return <PageBackgroundContext.Provider value={value}>{children}</PageBackgroundContext.Provider>;
}

export function usePageBackgroundConfig() {
   return useContext(PageBackgroundContext).config;
}

// drop-in replacement for pages, sets the layout-level background.
// clears on unmount so pages without SetPageBackground show no background.
// when navigating between two pages that both set a background, react batches
// the cleanup + new effect into a single commit so the crossfade stays intact.
export function SetPageBackground({ src, candidates, invertImage, reducedBlur }: BackgroundConfig) {
   const { set } = useContext(PageBackgroundContext);
   useEffect(() => {
      set({ src, candidates, invertImage, reducedBlur });
      return () => set(null);
   }, [candidates, invertImage, reducedBlur, set, src]);
   return null;
}
