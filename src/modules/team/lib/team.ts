import '@tanstack/react-start/server-only';

import { Result, TaggedError } from 'better-result';
import * as z from 'zod';

import { fetchGithubJson, type GithubJsonErrorInput } from '@/shared/result/github';

const GITHUB_REPO = 'ScoreSaber/scoresaber-team';
const TEAM_FILE_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/team.json?ref=main`;

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

const githubContentSchema = z.object({
   content: z.string(),
   encoding: z.literal('base64')
});

class TeamFetchError extends TaggedError('TeamFetchError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

function teamFetchError({ message, status, cause }: GithubJsonErrorInput) {
   return new TeamFetchError({ message, status, cause });
}

function parseTeamJson(json: string) {
   return Result.try({
      try: () => teamSchema.parse(JSON.parse(json)),
      catch: (cause) =>
         teamFetchError({
            message: 'failed to parse team data',
            status: null,
            cause
         })
   });
}

export function fetchTeam() {
   return Result.gen(async function* () {
      const file = yield* Result.await(fetchGithubJson(TEAM_FILE_URL, githubContentSchema, teamFetchError, 'github team fetch'));
      const team = yield* parseTeamJson(Buffer.from(file.content, 'base64').toString('utf8'));
      return Result.ok(team);
   });
}
