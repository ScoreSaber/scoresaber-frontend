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

   $: teams = $team
      ? [
           { title: 'Creator & Project Lead', members: $team.TeamMembers.Backend },
           { title: 'Admin', members: $team.TeamMembers.Admin, removeUmbra: true },
           { title: 'Nomination Assessment Team', members: $team.TeamMembers.NAT },
           { title: 'Ranking Team', members: $team.TeamMembers.RT },
           { title: 'Quality Assurance Team', members: $team.TeamMembers.QAT },
           { title: 'Criteria Assurance Team', members: $team.TeamMembers.CAT },
           { title: 'Content Creation Team', members: $team.TeamMembers.CCT, removeUmbra: true },
           { title: 'Frontend Developers', members: $team.TeamMembers.Frontend },
           { title: 'PC Mod', members: $team.TeamMembers.Mod },
           { title: 'PPv3', members: $team.TeamMembers.PPv3, removeUmbra: true }
        ]
      : [];
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
         <h1 class="title is-4 team-page-title">The ScoreSaber Team</h1>
         <div class="team-container">
            {#each teams as teamConfig}
               <TeamItem title={teamConfig.title} teamMembers={teamConfig.members} removeUmbra={teamConfig.removeUmbra || false} />
            {/each}
         </div>
      {/if}
   </div>
</div>

<style>
   .team-page-title {
      margin-bottom: 2rem;
      text-align: center;
   }

   .team-container {
      padding-top: 0.5rem;
   }

   @media (max-width: 768px) {
      .team-page-title {
         margin-bottom: 1.5rem;
         font-size: 1.5rem;
      }
   }
</style>
