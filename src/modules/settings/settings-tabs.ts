import { linkOptions } from '@tanstack/react-router';
import { z } from 'zod';

const settingsTabSchema = z.enum(['account', 'connections', 'perks', 'developer']);
export const SETTINGS_TABS = settingsTabSchema.options;
export type SettingsTab = z.infer<typeof settingsTabSchema>;

const perksSubTabSchema = z.enum(['overview', 'replays']);
export const PERKS_SUB_TABS = perksSubTabSchema.options;
export type PerksSubTab = z.infer<typeof perksSubTabSchema>;

export function buildSettingsLocation(tab: SettingsTab) {
   if (tab === 'account') return linkOptions({ to: '/settings/account' });
   if (tab === 'connections') return linkOptions({ to: '/settings/connections' });
   if (tab === 'developer') return linkOptions({ to: '/settings/developer' });

   return linkOptions({ to: '/settings/perks' });
}

export function buildSettingsPerksLocation(tab: PerksSubTab) {
   if (tab === 'replays') return linkOptions({ to: '/settings/perks/replays' });

   return linkOptions({ to: '/settings/perks' });
}
