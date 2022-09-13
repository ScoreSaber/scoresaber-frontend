<script lang="ts">
   import { setBackground } from '$lib/stores/global-store';

   import TeamItem from '$lib/components/team/team-item.svelte';
   import Loader from '$lib/components/common/loader.svelte';

   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';

   import type { ScoreSaberTeam } from '$lib/models/ScoreSaberTeam';

   const { data: team, error } = useAccio<ScoreSaberTeam>('https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/team.json', {
      fetcher: axios,
      withCredentials: false
   });

   setBackground('/images/banner.jpg');
</script>

<head>
   <title>Team | ScoreSaber!</title>
</head>

<div class="section">
   <div class="window has-shadow">
      {#if !error && !$team}
         <Loader />
      {/if}
      {#if $error}
         <p>{$error}</p>
      {/if}
      {#if $team}
         <h1 class="title is-4">The ScoreSaber Team</h1>
         <div>
            <TeamItem title="Creator & Project Lead" teamMembers={$team.TeamMembers.Backend} />
            <TeamItem title="Admin" teamMembers={$team.TeamMembers.Admin} removeUmbra={true} />
            <TeamItem title="Nomination Assessment Team" teamMembers={$team.TeamMembers.NAT} />
            <TeamItem title="Ranking Team" teamMembers={$team.TeamMembers.RT} />
            <TeamItem title="Quality Assurance Team" teamMembers={$team.TeamMembers.QAT} />
            <TeamItem title="Criteria Assurance Team" teamMembers={$team.TeamMembers.CAT} />
            <TeamItem title="Frontend Developers" teamMembers={$team.TeamMembers.Frontend} />
            <TeamItem title="PC Mod" teamMembers={$team.TeamMembers.Mod} />
            <TeamItem title="PPv3" teamMembers={$team.TeamMembers.PPv3} removeUmbra={true} />
         </div>
      {/if}
   </div>
</div>

<style>
</style>
