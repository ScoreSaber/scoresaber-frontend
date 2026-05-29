import '@tanstack/react-start/server-only';

import { Result, TaggedError } from 'better-result';
import * as z from 'zod';

const GITHUB_REPO = 'ScoreSaber/scoresaber-team';
const TEAM_FILE_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/team.json?ref=main`;
const IMAGE_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/images`;

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

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamData = z.infer<typeof teamSchema>;

export class TeamFetchError extends TaggedError('TeamFetchError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

export function getTeamImageUrl(profilePicture: string) {
   return `${IMAGE_BASE_URL}/${profilePicture}`;
}

export function fetchTeam() {
   return Result.tryPromise({
      try: async () => {
         const headers: Record<string, string> = {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
         };
         if (process.env.GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
         }

         const response = await fetch(TEAM_FILE_URL, {
            headers
         });

         if (!response.ok) {
            throw new TeamFetchError({
               message: `github team fetch failed: ${response.status}`,
               status: response.status,
               cause: null
            });
         }

         const file = githubContentSchema.parse(await response.json());
         const json = Buffer.from(file.content, 'base64').toString('utf8');
         return teamSchema.parse(JSON.parse(json));
      },
      catch: (cause) =>
         cause instanceof TeamFetchError
            ? cause
            : new TeamFetchError({
                 message: cause instanceof Error ? cause.message : 'failed to load team',
                 status: null,
                 cause
              })
   });
}
