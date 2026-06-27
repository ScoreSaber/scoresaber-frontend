import { createServerFn } from '@tanstack/react-start';

import {
   type LiveTournamentControllerCreateTournamentPayload,
   type LiveMatchCommandControllerBottifyPlayerPayload,
   type LiveMatchCommandControllerStartMapPayload,
   type LiveMatchCommandControllerPromptPayload,
   type LiveMatchRoomControllerSetRoomMembersPayload,
   type LiveMatchRoomControllerSetRoomSongPayload,
   type LiveTournamentRosterControllerSyncAuthorizedPlayersPayload,
   type LiveTournamentRosterControllerUpsertTeamPayload,
   type LiveTournamentRosterControllerUpsertRolePayload,
   type LiveMatchRoomControllerUpsertRoomPayload,
   type LiveTournamentControllerUpsertSettingsPayload
} from '@/shared/api/generated/Api';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionFailure, actionSuccess } from '@/shared/result/action';

const createLiveTournamentFn = createServerFn({ method: 'POST' })
   .inputValidator((data: LiveTournamentControllerCreateTournamentPayload) => data)
   .handler(({ data }) => actionApiData(api.livePlatform.liveTournamentControllerCreateTournament(data)));

const upsertLiveSettingsFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; payload: LiveTournamentControllerUpsertSettingsPayload }) => data)
   .handler(({ data }) => actionApiData(api.livePlatform.liveTournamentControllerUpsertSettings({ tournamentId: data.tournamentId }, data.payload)));

const upsertLiveRoleFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; payload: LiveTournamentRosterControllerUpsertRolePayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveTournamentRosterControllerUpsertRole({ tournamentId: data.tournamentId }, data.payload))
   );

const deleteLiveRoleFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; roleId: number }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveTournamentRosterControllerDeleteRole({ tournamentId: data.tournamentId, roleId: data.roleId }))
   );

const assignLiveRoleFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; roleId: number; playerId: string }) => data)
   .handler(({ data }) =>
      actionApiData(
         api.livePlatform.liveTournamentRosterControllerAssignRole(
            { tournamentId: data.tournamentId, roleId: data.roleId },
            { playerId: data.playerId }
         )
      )
   );

const unassignLiveRoleFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; roleId: number; playerId: string }) => data)
   .handler(({ data }) =>
      actionApiData(
         api.livePlatform.liveTournamentRosterControllerUnassignRole({
            tournamentId: data.tournamentId,
            roleId: data.roleId,
            playerId: data.playerId
         })
      )
   );

const upsertLiveTeamFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; payload: LiveTournamentRosterControllerUpsertTeamPayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveTournamentRosterControllerUpsertTeam({ tournamentId: data.tournamentId }, data.payload))
   );

const deleteLiveTeamFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; teamId: number }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveTournamentRosterControllerDeleteTeam({ tournamentId: data.tournamentId, teamId: data.teamId }))
   );

const syncLiveAuthorizedPlayersFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; payload: LiveTournamentRosterControllerSyncAuthorizedPlayersPayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveTournamentRosterControllerSyncAuthorizedPlayers({ tournamentId: data.tournamentId }, data.payload))
   );

const upsertLiveRoomFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; payload: LiveMatchRoomControllerUpsertRoomPayload }) => data)
   .handler(({ data }) => actionApiData(api.livePlatform.liveMatchRoomControllerUpsertRoom({ tournamentId: data.tournamentId }, data.payload)));

const setLiveRoomMembersFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string; payload: LiveMatchRoomControllerSetRoomMembersPayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchRoomControllerSetRoomMembers({ tournamentId: data.tournamentId, matchId: data.matchId }, data.payload))
   );

const setLiveRoomSongFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string; payload: LiveMatchRoomControllerSetRoomSongPayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchRoomControllerSetRoomSong({ tournamentId: data.tournamentId, matchId: data.matchId }, data.payload))
   );

const closeLiveRoomFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchRoomControllerCloseRoom({ tournamentId: data.tournamentId, matchId: data.matchId }))
   );

const deleteLiveRoomFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchRoomControllerDeleteRoom({ tournamentId: data.tournamentId, matchId: data.matchId }))
   );

const startLiveRoomMapFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string; payload: LiveMatchCommandControllerStartMapPayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchCommandControllerStartMap({ tournamentId: data.tournamentId, matchId: data.matchId }, data.payload))
   );

const returnLiveRoomToMenuFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchCommandControllerReturnToMenu({ tournamentId: data.tournamentId, matchId: data.matchId }))
   );

const promptLiveRoomFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string; payload: LiveMatchCommandControllerPromptPayload }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchCommandControllerPrompt({ tournamentId: data.tournamentId, matchId: data.matchId }, data.payload))
   );

const bottifyLivePlayerFn = createServerFn({ method: 'POST' })
   .inputValidator(
      (data: { tournamentId: string; matchId: string; playerId: string; payload: LiveMatchCommandControllerBottifyPlayerPayload }) => data
   )
   .handler(({ data }) =>
      actionApiData(
         api.livePlatform.liveMatchCommandControllerBottifyPlayer(
            { tournamentId: data.tournamentId, matchId: data.matchId, playerId: data.playerId },
            data.payload
         )
      )
   );

const bottifyLivePlayersFn = createServerFn({ method: 'POST' })
   .inputValidator(
      (data: { tournamentId: string; matchId: string; playerIds: string[]; payload: LiveMatchCommandControllerBottifyPlayerPayload }) => data
   )
   .handler(async ({ data }) => {
      const playerIds = [...new Set(data.playerIds)];
      if (playerIds.length === 0) return actionFailure('No players to bottify');

      for (const playerId of playerIds) {
         const result = await actionApiData(
            api.livePlatform.liveMatchCommandControllerBottifyPlayer(
               { tournamentId: data.tournamentId, matchId: data.matchId, playerId },
               data.payload
            )
         );

         if (!result.ok) return result;
      }

      return actionSuccess({ count: playerIds.length });
   });

const unbottifyLivePlayerFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string; playerId: string }) => data)
   .handler(({ data }) =>
      actionApiData(
         api.livePlatform.liveMatchCommandControllerUnbottifyPlayer({
            tournamentId: data.tournamentId,
            matchId: data.matchId,
            playerId: data.playerId
         })
      )
   );

const followLiveRoomFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { tournamentId: string; matchId: string }) => data)
   .handler(({ data }) =>
      actionApiData(api.livePlatform.liveMatchCommandControllerFollowRoom({ tournamentId: data.tournamentId }, { matchId: data.matchId }))
   );

export async function createLiveTournament(payload: LiveTournamentControllerCreateTournamentPayload) {
   return createLiveTournamentFn({ data: payload });
}

export async function upsertLiveSettings(tournamentId: string, payload: LiveTournamentControllerUpsertSettingsPayload) {
   return upsertLiveSettingsFn({ data: { tournamentId, payload } });
}

export async function upsertLiveRole(tournamentId: string, payload: LiveTournamentRosterControllerUpsertRolePayload) {
   return upsertLiveRoleFn({ data: { tournamentId, payload } });
}

export async function deleteLiveRole(tournamentId: string, roleId: number) {
   return deleteLiveRoleFn({ data: { tournamentId, roleId } });
}

export async function assignLiveRole(tournamentId: string, roleId: number, playerId: string) {
   return assignLiveRoleFn({ data: { tournamentId, roleId, playerId } });
}

export async function unassignLiveRole(tournamentId: string, roleId: number, playerId: string) {
   return unassignLiveRoleFn({ data: { tournamentId, roleId, playerId } });
}

export async function upsertLiveTeam(tournamentId: string, payload: LiveTournamentRosterControllerUpsertTeamPayload) {
   return upsertLiveTeamFn({ data: { tournamentId, payload } });
}

export async function deleteLiveTeam(tournamentId: string, teamId: number) {
   return deleteLiveTeamFn({ data: { tournamentId, teamId } });
}

export async function syncLiveAuthorizedPlayers(tournamentId: string, payload: LiveTournamentRosterControllerSyncAuthorizedPlayersPayload) {
   return syncLiveAuthorizedPlayersFn({ data: { tournamentId, payload } });
}

export async function upsertLiveRoom(tournamentId: string, payload: LiveMatchRoomControllerUpsertRoomPayload) {
   return upsertLiveRoomFn({ data: { tournamentId, payload } });
}

export async function setLiveRoomMembers(tournamentId: string, matchId: string, payload: LiveMatchRoomControllerSetRoomMembersPayload) {
   return setLiveRoomMembersFn({ data: { tournamentId, matchId, payload } });
}

export async function setLiveRoomSong(tournamentId: string, matchId: string, payload: LiveMatchRoomControllerSetRoomSongPayload) {
   return setLiveRoomSongFn({ data: { tournamentId, matchId, payload } });
}

export async function closeLiveRoom(tournamentId: string, matchId: string) {
   return closeLiveRoomFn({ data: { tournamentId, matchId } });
}

export async function deleteLiveRoom(tournamentId: string, matchId: string) {
   return deleteLiveRoomFn({ data: { tournamentId, matchId } });
}

export async function startLiveRoomMap(tournamentId: string, matchId: string, payload: LiveMatchCommandControllerStartMapPayload) {
   return startLiveRoomMapFn({ data: { tournamentId, matchId, payload } });
}

export async function returnLiveRoomToMenu(tournamentId: string, matchId: string) {
   return returnLiveRoomToMenuFn({ data: { tournamentId, matchId } });
}

export async function promptLiveRoom(tournamentId: string, matchId: string, payload: LiveMatchCommandControllerPromptPayload) {
   return promptLiveRoomFn({ data: { tournamentId, matchId, payload } });
}

export async function bottifyLivePlayer(
   tournamentId: string,
   matchId: string,
   playerId: string,
   payload: LiveMatchCommandControllerBottifyPlayerPayload
) {
   return bottifyLivePlayerFn({ data: { tournamentId, matchId, playerId, payload } });
}

export async function bottifyLivePlayers(
   tournamentId: string,
   matchId: string,
   playerIds: string[],
   payload: LiveMatchCommandControllerBottifyPlayerPayload
) {
   return bottifyLivePlayersFn({ data: { tournamentId, matchId, playerIds, payload } });
}

export async function unbottifyLivePlayer(tournamentId: string, matchId: string, playerId: string) {
   return unbottifyLivePlayerFn({ data: { tournamentId, matchId, playerId } });
}

export async function followLiveRoom(tournamentId: string, matchId: string) {
   return followLiveRoomFn({ data: { tournamentId, matchId } });
}
