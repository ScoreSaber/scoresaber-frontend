import { z } from 'zod';

export const LIVE_TABS = ['settings', 'players', 'teams', 'roles', 'rooms'] as const;
export const liveTabSchema = z.enum(LIVE_TABS);
export type LiveTab = z.infer<typeof liveTabSchema>;
