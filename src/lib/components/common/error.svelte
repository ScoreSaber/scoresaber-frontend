<script lang="ts">
   export let message: string = '';
   export let status: number;
   export let fullpage = false;

   console.error({ message, status });
</script>

<div class="error {fullpage ? 'fullpage' : ''}">
   {#if status == 404}
      <h1>Page not found</h1>
      <p>This website is beta software, there's a fair few dead links.</p>
   {:else}
      <h1>{message?.length < 100 ? message.replace(/^Error: /, '') : `Error ${status ?? ''}`}</h1>
      <p>Looks like something's gone wrong.</p>
      <p>This website' beta software, for now it's pretty safe to just ignore this</p>
      <p class="status">Error info has been logged to console.</p>
   {/if}
</div>

<style>
   .error {
      flex: 1;
      padding: 3em;
   }

   .status {
      opacity: 0.5;
      font-style: italic;
   }
   .error.fullpage {
      font-size: 2em;
   }
   h1 {
      font-size: 3em;
      color: var(--scoreSaberYellow);
   }

   pre {
      background: #3c3c3c;
      color: #eee;
   }

   @media (max-width: 512px) {
      .error.fullpage {
         font-size: 1.5em;
      }
   }
</style>
