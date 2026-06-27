import '@tanstack/react-start/server-only';

import { TaggedError } from 'better-result';
import * as z from 'zod';

import { createGithubJsonFetcher, type GithubJsonErrorInput } from '@/shared/result/github';

const GITHUB_REPO = 'ScoreSaber/scoresaber-team';
const TEAM_FILE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/team.json`;

const nullableString = z.string().nullable().optional();

const teamMemberSchema = z.object({
   Name: z.string(),
   ProfilePicture: z.string(),
   Discord: nullableString,
   GitHub: nullableString,
   Twitch: nullableString,
   Twitter: nullableString,
   YouTube: nullableString
});

const teamMembersSchema = z.object({
   Backend: z.array(teamMemberSchema),
   Frontend: z.array(teamMemberSchema),
   Mod: z.array(teamMemberSchema),
   PPv3: z.array(teamMemberSchema),
   Admin: z.array(teamMemberSchema),
   NAT: z.array(teamMemberSchema),
   RT: z.array(teamMemberSchema),
   QAT: z.array(teamMemberSchema),
   CAT: z.array(teamMemberSchema),
   CCT: z.array(teamMemberSchema)
});

const teamSchema = z.object({
   TeamMembers: teamMembersSchema
});

class TeamFetchError extends TaggedError('TeamFetchError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

function teamFetchError({ message, status, cause }: GithubJsonErrorInput) {
   return new TeamFetchError({ message, status, cause });
}

const fetchTeamJson = createGithubJsonFetcher(TEAM_FILE_URL, teamSchema, teamFetchError, 'github team fetch');

export function fetchTeam() {
   return fetchTeamJson();
}
