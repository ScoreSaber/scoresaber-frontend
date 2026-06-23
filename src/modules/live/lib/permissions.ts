import Permissions from '@/shared/permissions';

const LIVE_PLATFORM_PERMISSION_MASK = Permissions.security.ADMIN | Permissions.security.TOURNAMENT_ORGANIZER;

export function canUseLivePlatform(permissions: number | undefined) {
   return Permissions.checkPermissionNumber(permissions ?? 0, LIVE_PLATFORM_PERMISSION_MASK);
}
