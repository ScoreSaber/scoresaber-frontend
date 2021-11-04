<script type="ts">
   import PaginationNav from './pagination/pagination-nav.svelte';

   export let totalItems: number;
   export let pageSize: number;
   export let currentPage: number;
   export let changePage: any;
</script>

<div class="pages">
   <PaginationNav {totalItems} {pageSize} {currentPage} limit={1} showStepOptions={true} on:setPage={(e) => changePage(e.detail.page)} />
</div>

<style>
   .pages :global(.pagination-nav) {
      display: flex;
      justify-content: center;
      gap: 1rem;
   }

   .pages :global(.option) {
      background-color: var(--gray);
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      font-size: 14px;
      border-radius: 5px;
      margin: 0;
   }

   .pages :global(.option.active) {
      background-color: var(--background);
   }

   .pages :global(.option.ellipsis) {
      background-color: var(--foreground);
      cursor: default;
   }

   .pages :global(.option.ellipsis):hover {
      background-color: var(--foreground);
   }

   .pages :global(.option):hover {
      background-color: var(--gray-light);
   }
</style>
