'use client';

import { useEffect, type ReactNode } from 'react';

import { getProfileAccentProperties, type PlayerProfileCustomizationStyle } from '@/modules/player/profile/player-profile-accent';

interface PlayerProfileAccentScopeProps {
   customization: PlayerProfileCustomizationStyle | null | undefined;
   children: ReactNode;
}

export function PlayerProfileAccentScope({ customization, children }: PlayerProfileAccentScopeProps) {
   const accentProperties = getProfileAccentProperties(customization);
   const accentColor = accentProperties?.['--profile-accent'];
   const accentForegroundColor = accentProperties?.['--profile-accent-foreground'];

   useEffect(() => {
      const root = document.documentElement;
      const previousAccent = root.style.getPropertyValue('--profile-accent');
      const previousAccentForeground = root.style.getPropertyValue('--profile-accent-foreground');

      if (accentColor && accentForegroundColor) {
         root.style.setProperty('--profile-accent', accentColor);
         root.style.setProperty('--profile-accent-foreground', accentForegroundColor);
      } else {
         root.style.removeProperty('--profile-accent');
         root.style.removeProperty('--profile-accent-foreground');
      }

      return () => {
         if (previousAccent) {
            root.style.setProperty('--profile-accent', previousAccent);
         } else {
            root.style.removeProperty('--profile-accent');
         }

         if (previousAccentForeground) {
            root.style.setProperty('--profile-accent-foreground', previousAccentForeground);
         } else {
            root.style.removeProperty('--profile-accent-foreground');
         }
      };
   }, [accentColor, accentForegroundColor]);

   return (
      <div className="contents" style={accentProperties}>
         {children}
      </div>
   );
}
