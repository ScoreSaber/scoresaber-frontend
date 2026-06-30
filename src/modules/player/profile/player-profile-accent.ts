import type { CSSProperties } from 'react';

import type { PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';

export type PlayerProfileCustomizationStyle = NonNullable<PlayerControllerGetPlayerResponse['profileCustomization']>;

export const DEFAULT_PROFILE_CUSTOMIZATION_STYLE: PlayerProfileCustomizationStyle = {
   accentColor: null,
   accentForegroundColor: null,
   supporterNameColorEnabled: true
};

type ProfileAccentProperties = CSSProperties & {
   '--profile-accent': string;
   '--profile-accent-foreground': string;
};

export function normalizeProfileCustomizationStyle(
   customization: PlayerProfileCustomizationStyle | null | undefined
): PlayerProfileCustomizationStyle {
   if (!customization) return DEFAULT_PROFILE_CUSTOMIZATION_STYLE;

   const accentColor = customization?.accentColor ?? null;

   return {
      accentColor,
      accentForegroundColor: accentColor ? (customization?.accentForegroundColor ?? null) : null,
      supporterNameColorEnabled: customization?.supporterNameColorEnabled ?? true
   };
}

export function getProfileAccentProperties(customization: PlayerProfileCustomizationStyle | null | undefined): ProfileAccentProperties | undefined {
   const style = normalizeProfileCustomizationStyle(customization);
   if (!style.accentColor) return undefined;

   return {
      '--profile-accent': style.accentColor,
      '--profile-accent-foreground': style.accentForegroundColor ?? getReadableProfileAccentForeground(style.accentColor)
   };
}

export function getReadableProfileAccentForeground(color: string) {
   const [r, g, b] = [1, 3, 5].map((start) => {
      const channel = Number.parseInt(color.slice(start, start + 2), 16);
      const normalized = channel / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
   });
   const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
   return luminance > 0.52 ? '#0f172a' : '#ffffff';
}
