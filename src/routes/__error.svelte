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
   import Error from '$lib/components/common/error.svelte';

   export let status: number;
   export let message: string;
</script>

<div class="page-container">
   <Error {status} {message} fullpage />
</div>

<style>
   .page-container {
      display: flex;
      flex-direction: column;
   }
</style>
