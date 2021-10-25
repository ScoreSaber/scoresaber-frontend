<script lang="ts">
   import { userData } from '$lib/global-store';
   import { page } from '$app/stores';
   $: loggedIn = $userData != undefined;
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="/yeehaw">yeeehaw</a></p>

<p>{$page.query.get('cock')}</p>
