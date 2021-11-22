<script lang="ts">
   import type { AccioError } from '$lib/utils/accio';

   export let error: AccioError;
   export let fullpage = false;

   console.error(error);
</script>

<div class="error {fullpage ? 'fullpage' : ''}">
   {#if error.status == 404}
      <h1>404</h1>
      {#if error.message}
         <p>{error.message}</p>
      {/if}
   {:else}
      <h1>Error {error.status ?? ''}</h1>
      <p>Looks like something's gone wrong.</p>
      <p class="status">Error info has been logged to console.</p>
   {/if}
</div>

<style>
   .error {
      flex: 1;
      padding: 2em 1.5em;
   }

   .status {
      opacity: 0.5;
      font-style: italic;
   }
   .error.fullpage {
      font-size: 2em;
      padding: 4em 3em;
   }
   h1 {
      font-size: 3em;
      color: var(--scoreSaberYellow);
   }
   @media (max-width: 512px) {
      .error.fullpage {
         font-size: 1.5em;
      }
   }
</style>
