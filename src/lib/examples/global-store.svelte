<script lang="ts">
   import { userData } from '$lib/global-store';
   import type { UserData } from '$lib/models/UserData';
   import { onMount } from 'svelte';
   import { page } from '$app/stores';

   const test: UserData = { playerId: '1234', permissions: 0, questKey: 'urmom' };

   onMount(() => {
      console.log($page.params);
      userData.set(test);
   });
</script>

<p>{$page.params}</p>

<p>Visit <a href="/">index</a></p>
