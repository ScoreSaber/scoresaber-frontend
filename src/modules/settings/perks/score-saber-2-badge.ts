import Permissions from '@/shared/permissions';

export const scoreSaber2Badge = {
   id: 116,
   imageUrl: 'https://cdn.scoresaber.com/badges/scoresaber-2.gif',
   width: 80,
   height: 30,
   claimsCloseAt: '2026-06-03T23:59:00-04:00',
   dismissedStorageKey: 'scoresaber-score-saber-2-badge-dismissed',
   promoDismissedStorageKey: 'scoresaber-score-saber-2-badge-promo-dismissed'
};

export function hasScoreSaber2Badge(player: { badges?: readonly { id: number }[] | null } | null | undefined) {
   return player?.badges?.some((badge) => badge.id === scoreSaber2Badge.id) ?? false;
}

export function canRedeemScoreSaber2Badge(permissions: number) {
   return (
      Permissions.checkPermissionNumber(permissions, Permissions.security.SUPPORTER) ||
      Permissions.checkPermissionNumber(permissions, Permissions.groups.ALL_STAFF)
   );
}
