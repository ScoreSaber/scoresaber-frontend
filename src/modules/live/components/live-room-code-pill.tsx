'use client';

import { Hash } from 'lucide-react';

import { CopyableCodePill, type CopyableCodePillSize } from '@/shared/components/copyable-code-pill';

export function LiveRoomCodePill({ roomCode, size = 'sm', className }: { roomCode: string; size?: CopyableCodePillSize; className?: string }) {
   return <CopyableCodePill value={roomCode} icon={<Hash />} size={size} className={className} />;
}
