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

   import { AccioError } from '$lib/utils/accio';

   export let name: string | undefined;
   export let message: string | undefined;
   export let stack: string | undefined = '';
   export let status: number | undefined;
</script>

<div class="page-container">
   <Error error={new AccioError(name, message, stack, status)} fullpage />
</div>

<style>
   .page-container {
      display: flex;
      flex-direction: column;
   }
</style>
