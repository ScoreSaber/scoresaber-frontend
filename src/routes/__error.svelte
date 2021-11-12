<script context="module" type="ts">
   export const load = ({ error, status }) => ({
      props: {
         ...error,
         status
      }
   });
</script>

<script type="ts">
   import Footer from '$lib/components/common/footer.svelte';
   import Navbar from '$lib/components/common/navbar.svelte';

   export let status: number;
   export let message: string;
</script>

<div class="page-container">
   <Navbar />
   <main>
      {#if status == 404}
         <h1>Page not found</h1>
         <p>This website is beta software, there's a fair few dead links.</p>
      {:else}
         <h1>Error {status}</h1>
         <p>Looks like something's gone wrong.</p>
         <p>This website' beta software, for now it's pretty safe to just ignore this</p>
         <h2>Guru Meditation:</h2>
         <pre>{message}</pre>
      {/if}
   </main>
   <Footer />
</div>

<style>
   main {
      flex: 1;
      padding: 3em;
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
      main {
         font-size: 1.5em;
      }
   }

   .page-container {
      min-height: calc(100vh - 61px);
      display: flex;
      flex-direction: column;
   }
</style>
