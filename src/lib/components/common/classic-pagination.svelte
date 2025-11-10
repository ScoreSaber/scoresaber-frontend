<script type="ts">
   import PaginationNav from '$lib/components/common/pagination/pagination-nav.svelte';

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
      gap: 0.5rem;
   }

   .pages :global(.option) {
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
      cursor: pointer;
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border-radius: 6px;
      margin: 0;
      transition: all var(--transitionTime) ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
      height: 2.5rem;
      box-sizing: border-box;
   }

   .pages :global(.option.active) {
      background: rgba(255, 215, 0, 0.15);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 215, 0, 0.3);
      color: var(--scoreSaberYellow);
   }

   .pages :global(.option.ellipsis) {
      background-color: transparent;
      border-color: transparent;
      cursor: pointer;
   }

   .pages :global(.option.disabled) {
      opacity: 0.3;
      cursor: not-allowed;
   }

   .pages :global(.option.prev) {
      padding: 0.5rem 0.75rem;
   }

   .pages :global(.option.next) {
      padding: 0.5rem 0.75rem;
   }

   .pages :global(.option.ellipsis):hover {
      background-color: transparent;
      border-color: transparent;
   }

   .pages :global(.option.disabled):hover {
      background-color: var(--foregroundItem);
   }

   .pages :global(.option.active):hover {
      background: rgba(255, 215, 0, 0.2);
      border-color: var(--scoreSaberYellow);
      cursor: default;
   }

   .pages :global(.option):hover:not(.disabled):not(.ellipsis):not(.active) {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
      color: var(--scoreSaberYellow);
   }

   .pages :global(.option:focus-visible) {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
   }
</style>
