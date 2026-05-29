import { z } from 'zod';

export const settingsTabSchema = z.enum(['account', 'connections', 'perks']);
export const SETTINGS_TABS = settingsTabSchema.options;
export type SettingsTab = z.infer<typeof settingsTabSchema>;

export const perksSubTabSchema = z.enum(['overview', 'replays', 'score-saber-2-badge']);
export const PERKS_SUB_TABS = perksSubTabSchema.options;
export type PerksSubTab = z.infer<typeof perksSubTabSchema>;

export function buildSettingsHref(tab: SettingsTab) {
   return `/settings/${tab}`;
}

export function buildSettingsPerksHref(tab: PerksSubTab) {
   return tab === 'overview' ? '/settings/perks' : `/settings/perks/${tab}`;
}
