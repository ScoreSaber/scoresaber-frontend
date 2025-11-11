<script lang="ts">
   import TeamMemberItem from '$lib/components/team/team-member-item.svelte';

   import type { TeamMember } from '$lib/models/ScoreSaberTeam';

   export let title: string;
   export let teamMembers: TeamMember[];
   export let removeUmbra = false;

   const teamColorKeywords: Record<string, string> = {
      panda: 'creator,project lead',
      admin: 'admin',
      nat: 'nomination assessment',
      rt: 'ranking team',
      qat: 'quality assurance',
      cat: 'criteria assurance',
      cct: 'content creation',
      dev: 'frontend,developer',
      ppv3: 'ppv3',
      mod: 'pc mod'
   };

   function getTeamColorClass(teamTitle: string): string {
      const titleLower = teamTitle.toLowerCase();
      for (const [color, keywords] of Object.entries(teamColorKeywords)) {
         if (keywords.split(',').some((keyword) => titleLower.includes(keyword.trim()))) {
            return color;
         }
      }
      return 'default';
   }

   $: teamColorClass = getTeamColorClass(title);
</script>

<div class="team-panel">
   <h2 class="title is-5">{title}</h2>
   <div class="columns is-multiline">
      {#each teamMembers as teamMember}
         {#if !(removeUmbra && teamMember.Name === 'Umbranox')}
            <TeamMemberItem {teamMember} {teamColorClass} />
         {/if}
      {/each}
   </div>
</div>

<style>
   .team-panel {
      margin-bottom: 2.5rem;
   }

   .team-panel:last-child {
      margin-bottom: 0;
   }

   .team-panel .title {
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--borderColor);
   }

   .team-panel .columns {
      margin-left: -0.5rem;
      margin-right: -0.5rem;
      margin-top: -0.5rem;
      display: flex;
      flex-wrap: wrap;
   }

   .team-panel :global(.columns .column) {
      padding: 0.5rem;
   }

   @media (max-width: 768px) {
      .team-panel .columns {
         margin-left: -0.25rem;
         margin-right: -0.25rem;
         margin-top: -0.25rem;
      }

      .team-panel :global(.columns .column) {
         padding: 0.25rem;
      }
   }
</style>
