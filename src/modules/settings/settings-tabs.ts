import { linkOptions } from '@tanstack/react-router';
import { z } from 'zod';

const settingsTabSchema = z.enum(['account', 'connections', 'perks', 'developer']);
export const SETTINGS_TABS = settingsTabSchema.options;
export type SettingsTab = z.infer<typeof settingsTabSchema>;

export function buildSettingsLocation(tab: SettingsTab) {
   if (tab === 'account') return linkOptions({ to: '/settings/account' });
   if (tab === 'connections') return linkOptions({ to: '/settings/connections' });
   if (tab === 'developer') return linkOptions({ to: '/settings/developer' });

   return linkOptions({ to: '/settings/perks/replays' });
}
