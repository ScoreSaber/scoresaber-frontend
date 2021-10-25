<script lang="ts" context="module">
   import { loadMetadata } from '$lib/metadata-loader';
   export async function load({ fetch }) {
      return await loadMetadata(fetch, 'https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/team.json');
   }
</script>

<script lang="ts">
   import type { ScoreSaberTeam } from '$lib/models/ScoreSaberTeam';
   import Meta from '$lib/components/common/meta.svelte';
   import axios from '$lib/utils/fetcher';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import TeamItem from '$lib/components/team/team-item.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import { useAccio } from '$lib/utils/accio';

   export let metadata: ScoreSaberTeam = undefined;
   const { data: team, error } = useAccio<ScoreSaberTeam>('https://raw.githubusercontent.com/Umbranoxio/ScoreSaber-Team/main/team.json', {
      fetcher: axios
   });
</script>

<head>
   <title>Team | ScoreSaber!</title>
   {#if metadata}
      <Meta title="{metadata.TeamMembers.QAT.length.toString()} QAT Members" />
   {/if}
</head>

<Navbar />

<div class="section">
   <div class="window has-shadow">
      {#if $team}
         <h1 class="title is-4">The ScoreSaber Team</h1>
         <div>
            <TeamItem title="Creator & Project Lead" teamMembers={$team.TeamMembers.Backend} />
            <TeamItem title="Admin" teamMembers={$team.TeamMembers.Admin} removeUmbra={true} />
            <TeamItem title="Nomination Assesment Team" teamMembers={$team.TeamMembers.NAT} />
            <TeamItem title="Ranking Team" teamMembers={$team.TeamMembers.RT} />
            <TeamItem title="Quality Assurance Team" teamMembers={$team.TeamMembers.QAT} />
            <TeamItem title="Criteria Assesment Team" teamMembers={$team.TeamMembers.CAT} />
            <TeamItem title="PC Mod" teamMembers={$team.TeamMembers.Mod} />
            <TeamItem title="PPv3" teamMembers={$team.TeamMembers.PPv3} removeUmbra={true} />
         </div>
      {:else if !$error}
         <Loader />
      {/if}
      {#if $error}
         <p>{$error}</p>
      {/if}
   </div>
</div>

<Footer />

<style>
</style>
