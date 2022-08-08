<script lang="ts" context="module">
   export interface PageCallback {
      (page: number): void;
   }
</script>

<script lang="ts">
   import ArrowButton from '$lib/components/common/pagination/arrow-button.svelte';

   export let page: number;
   export let maxPages: number;
   export let pageSize: number;
   export let pageClicked: PageCallback;
   export let withFirstLast = false;

   $: fixedMaxPages = Math.ceil(maxPages / pageSize);
</script>

<nav class="pagination">
   <section class="btn-group">
      {#if withFirstLast}
         <ArrowButton icon="fa-step-backward" on:click={() => pageClicked(1)} disabled={page <= 1} />
      {/if}
      <ArrowButton icon="fa-arrow-left" on:click={() => pageClicked(page - 1)} disabled={page <= 1} />
   </section>

   <section class="btn-group">
      <ArrowButton icon="fa-arrow-right" on:click={() => pageClicked(page + 1)} disabled={page >= fixedMaxPages} />

      {#if withFirstLast}
         <ArrowButton icon="fa-step-forward" on:click={() => pageClicked(fixedMaxPages)} disabled={page >= fixedMaxPages} />
      {/if}
   </section>
</nav>

<style>
   .pagination {
      margin-bottom: 0.1rem;
   }

   .btn-group {
      display: inline-flex;
   }
</style>
