<script lang="ts">
   export let message: string = '';
</script>

<div>
   <div class="is-center">
      {#if message}
         <p>{message}</p>
      {:else}
         <p>Seems like we ran into an error, to get back to safety <a href="/">Click here!</a></p>
      {/if}
   </div>
</div>
