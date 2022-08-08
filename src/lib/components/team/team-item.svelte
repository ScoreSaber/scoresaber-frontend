<script lang="ts">
   import TeamMemberItem from '$lib/components/team/team-member-item.svelte';

   import type { TeamMember } from '$lib/models/ScoreSaberTeam';

   export let title: string;
   export let teamMembers: TeamMember[];
   export let removeUmbra = false;
</script>

<div class="team-panel">
   <h2 class="title is-5">{title}</h2>
   <div class="columns is-multiline">
      {#each teamMembers as teamMember}
         {#if removeUmbra && teamMember.Name === 'Umbranox'}
            <div />
         {:else}
            <TeamMemberItem {teamMember} />
         {/if}
      {/each}
   </div>
</div>

<style>
   div.team-panel {
      margin-bottom: 20px;
   }
</style>
