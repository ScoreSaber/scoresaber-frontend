'use client';

import { FaKey } from 'react-icons/fa';

import { CopyableCodePill, type CopyableCodePillSize, type CopyableCodePillVariant } from '@/shared/components/copyable-code-pill';

export function BeatSaverKeyPill({
   beatSaverKey,
   variant = 'link',
   size = 'sm',
   className
}: {
   beatSaverKey: string;
   variant?: CopyableCodePillVariant;
   size?: CopyableCodePillSize;
   className?: string;
}) {
   const beatSaverUrl = `https://beatsaver.com/maps/${beatSaverKey}`;

   return <CopyableCodePill value={beatSaverKey} href={beatSaverUrl} icon={<FaKey />} variant={variant} size={size} className={className} />;
}
