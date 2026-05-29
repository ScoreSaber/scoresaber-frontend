'use client';

import { createContext, useContext } from 'react';

import type { PlayerChartContextValue } from '@/modules/player/chart/chart-types';

const PlayerChartContext = createContext<PlayerChartContextValue | null>(null);

function usePlayerChartContext() {
   const ctx = useContext(PlayerChartContext);
   if (!ctx) throw new Error('usePlayerChartContext must be used within PlayerChartProvider');
   return ctx;
}

export { PlayerChartContext, usePlayerChartContext };
