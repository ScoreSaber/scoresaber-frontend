import type {
   LeaderboardControllerGetLeaderboardByIdResponse,
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   MapControllerGetMapByIdResponse,
   MapControllerGetMapListingsDataItem,
   PlayerControllerGetPlayerResponse,
   PlayerControllerGetPlayersDataItem,
   UserControllerGetMeResponse
} from '@/shared/api/generated/ApiParams';
import Permissions from '@/shared/permissions';

type MapLeaderboard = MapControllerGetMapListingsDataItem['leaderboards'][number] | MapControllerGetMapByIdResponse['leaderboards'][number];
type LeaderboardStatus = MapLeaderboard['realm']['leaderboardStatus'];

export const CARD_GRADIENT_CLASSES =
   'relative overflow-hidden rounded border bg-card dark:bg-linear-to-br dark:from-card dark:via-card/95 dark:to-card/90';
export const BLURRED_BG_IMAGE_CLASSES = 'object-cover w-full h-full blur-2xl scale-110';

const DIFFICULTY_BG_CLASS: Record<number, string> = {
   1: 'bg-difficulty-easy',
   3: 'bg-difficulty-normal',
   5: 'bg-difficulty-hard',
   7: 'bg-difficulty-expert',
   9: 'bg-difficulty-expert-plus'
};

const DIFFICULTY_TEXT_CLASS: Record<number, string> = {
   1: 'text-difficulty-easy',
   3: 'text-difficulty-normal',
   5: 'text-difficulty-hard',
   7: 'text-difficulty-expert',
   9: 'text-difficulty-expert-plus'
};

const DIFFICULTY_TINT_CLASS: Record<number, string> = {
   1: 'border-difficulty-easy/40 bg-difficulty-easy/10',
   3: 'border-difficulty-normal/40 bg-difficulty-normal/10',
   5: 'border-difficulty-hard/40 bg-difficulty-hard/10',
   7: 'border-difficulty-expert/40 bg-difficulty-expert/10',
   9: 'border-difficulty-expert-plus/40 bg-difficulty-expert-plus/10'
};

const STATUS_ACCENT_CLASS: Partial<Record<LeaderboardStatus, string>> = {
   RANKED: 'bg-status-success',
   QUALIFIED: 'bg-chart-primary',
   LOVED: 'bg-difficulty-expert-plus'
};

const STATUS_LABEL: Partial<Record<LeaderboardStatus, string>> = {
   RANKED: 'Ranked',
   QUALIFIED: 'Qualified',
   LOVED: 'Loved'
};

export function getDifficultyBgClass(difficulty: number) {
   return DIFFICULTY_BG_CLASS[difficulty] ?? 'bg-muted';
}

export function getDifficultyTextClass(difficulty: number) {
   return DIFFICULTY_TEXT_CLASS[difficulty] ?? 'text-muted-foreground';
}

export function getDifficultyTintClass(difficulty: number) {
   return DIFFICULTY_TINT_CLASS[difficulty] ?? 'border bg-secondary/35';
}

export function getStatusAccentClass(status: LeaderboardStatus) {
   return STATUS_ACCENT_CLASS[status] ?? 'bg-muted';
}

export function getStatusLabel(status: LeaderboardStatus) {
   return STATUS_LABEL[status] ?? 'Unranked';
}

export function isLeaderboardRanked(leaderboard: LeaderboardControllerGetLeaderboardByIdResponse) {
   return leaderboard.realm.leaderboardStatus === 'RANKED';
}

// highest status across a collection of leaderboards
export function getHighestStatus(leaderboards: MapLeaderboard[]): LeaderboardStatus {
   const priority: LeaderboardStatus[] = ['RANKED', 'QUALIFIED', 'LOVED', 'UNRANKED'];
   for (const status of priority) {
      if (leaderboards.some((lb) => lb.realm.leaderboardStatus === status)) {
         return status;
      }
   }
   return 'UNRANKED';
}

type RolePrefix = 'text' | 'bg';

type RoleKey = 'owner' | 'admin' | 'qat-head' | 'nat' | 'rt' | 'rtr' | 'qat' | 'cat' | 'ppv3' | 'dev' | 'cct' | 'supporter' | 'default';

const ROLE_CLASS_MAP: Record<RolePrefix, Record<RoleKey, string>> = {
   text: {
      owner: 'text-role-owner',
      admin: 'text-role-admin',
      'qat-head': 'text-role-qat-head',
      nat: 'text-role-nat',
      rt: 'text-role-rt',
      rtr: 'text-role-rtr',
      qat: 'text-role-qat',
      cat: 'text-role-cat',
      ppv3: 'text-role-ppv3',
      dev: 'text-role-dev',
      cct: 'text-role-cct',
      supporter: 'text-role-supporter',
      default: 'text-role-default'
   },
   bg: {
      owner: 'bg-role-owner',
      admin: 'bg-role-admin',
      'qat-head': 'bg-role-qat-head',
      nat: 'bg-role-nat',
      rt: 'bg-role-rt',
      rtr: 'bg-role-rtr',
      qat: 'bg-role-qat',
      cat: 'bg-role-cat',
      ppv3: 'bg-role-ppv3',
      dev: 'bg-role-dev',
      cct: 'bg-role-cct',
      supporter: 'bg-role-supporter',
      default: 'bg-role-default'
   }
};

const ROLE_TEXT_PRIORITY: { key: RoleKey; title: string; labels: string[] }[] = [
   { key: 'owner', title: 'Owner of ScoreSaber', labels: ['Owner'] },
   { key: 'admin', title: 'ScoreSaber Admin', labels: ['Admin'] },
   { key: 'qat-head', title: 'Head of Quality Assurance', labels: ['QAT Head'] },
   { key: 'nat', title: 'Nomination Assessment Team', labels: ['NAT', 'Nomination Assessment Team'] },
   { key: 'rt', title: 'Ranking Team', labels: ['RT', 'Ranking Team'] },
   { key: 'rtr', title: 'Ranking Team Recruit', labels: ['RTR', 'Ranking Team Recruit', 'Recruit'] },
   { key: 'qat', title: 'Quality Assurance Team', labels: ['QAT', 'Quality Assurance Team'] },
   { key: 'cat', title: 'Criteria Assurance Team', labels: ['CAT', 'Criteria Assurance Team'] },
   { key: 'ppv3', title: 'PPv3 Developer', labels: ['PPv3'] },
   { key: 'dev', title: 'A Developer for ScoreSaber', labels: ['Developer'] },
   { key: 'cct', title: 'Content Creation Team', labels: ['CCT', 'Content Creation Lead', 'Content Creation Team'] },
   { key: 'supporter', title: 'ScoreSaber Supporter', labels: ['Supporter'] }
];

export function normalizePlayerRoleText(role: string) {
   return role.replaceAll('supporter', 'Supporter').replaceAll('pp-farmer', 'Supporter');
}

export type PlayerRoleSource =
   | PlayerControllerGetPlayerResponse
   | PlayerControllerGetPlayersDataItem
   | LeaderboardControllerGetLeaderboardScoresByIdDataItem['player']
   | UserControllerGetMeResponse;

function resolvePlayerRole(player: PlayerRoleSource): [RoleKey, string | null] {
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.PANDA)) {
      return ['owner', 'Owner of ScoreSaber'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.ADMIN)) {
      return ['admin', 'ScoreSaber Admin'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.QATHead)) {
      return ['qat-head', 'Head of Quality Assurance'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.NAT)) {
      return ['nat', 'Nomination Assessment Team'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.RT)) {
      return ['rt', 'Ranking Team'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.RTR)) {
      return ['rtr', 'Ranking Team Recruit'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.QAT)) {
      return ['qat', 'Quality Assurance Team'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.CAT)) {
      return ['cat', 'Criteria Assurance Team'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.PPV3)) {
      return ['ppv3', 'PPv3 Developer'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.DEV)) {
      return ['dev', 'A Developer for ScoreSaber'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.CCTHead)) {
      return ['cct', 'Content Creation Lead'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.CCT)) {
      return ['cct', 'Content Creation Team'];
   }
   if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.SUPPORTER)) {
      return ['supporter', 'ScoreSaber Supporter'];
   }

   if (player.role) {
      const roleText = normalizePlayerRoleText(player.role);
      for (const role of ROLE_TEXT_PRIORITY) {
         if (role.labels.some((label) => roleText === label || roleText.includes(label))) {
            return [role.key, role.title];
         }
      }
      return ['default', roleText];
   }
   return ['default', player.name];
}

export function getPlayerRoleStyleAndTitle(player: PlayerRoleSource | null, prefix: RolePrefix = 'text'): [string, string | null] {
   if (!player) {
      return [ROLE_CLASS_MAP[prefix].default, null];
   }

   const [roleKey, title] = resolvePlayerRole(player);
   return [ROLE_CLASS_MAP[prefix][roleKey], title];
}
