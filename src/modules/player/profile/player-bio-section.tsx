'use client';

import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/modules/auth';
import { PlayerBio } from '@/modules/player/profile/player-bio';
import { PlayerBioEditor } from '@/modules/player/profile/player-bio-editor';
import Permissions from '@/shared/permissions';

interface PlayerBioSectionProps {
   bio: string;
   sanitizedBio: string;
   hasBioContent: boolean;
   playerId: string;
   showSeparator?: boolean;
}

export function PlayerBioSection({ bio, sanitizedBio, hasBioContent, playerId, showSeparator = true }: PlayerBioSectionProps) {
   const { user } = useAuth();
   const isOwnProfile = user?.id === playerId;
   const userPerms = user?.permissions ?? 0;
   const canEditBio = isOwnProfile && Permissions.isSupporter(userPerms);

   if (!hasBioContent && !canEditBio) return null;

   return (
      <div className="py-4">
         {showSeparator && <Separator variant="gradient" className="mb-4" />}
         {canEditBio ? <PlayerBioEditor bio={bio} /> : hasBioContent && <PlayerBio sanitizedBio={sanitizedBio} />}
      </div>
   );
}
