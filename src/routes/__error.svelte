<script context="module" type="ts">
   export const load = ({ error, status }) => ({
      props: {
         ...error,
         status
      }
   });
</script>

<script type="ts">
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
