<script lang="ts" context="module">
   export interface PageCallback {
      (page: number): void;
   }
</script>

<script lang="ts">
   export let page: number;
   export let maxPages: number;
   export let pageClicked: PageCallback;
</script>

<nav class="pagination">
   {#if page > 1}
      <button on:click={() => pageClicked(page - 1)} class="button arrow">
         <span class="icon is-small">
            <i class="fas fa-arrow-left" />
         </span>
      </button>
   {:else}
      <button class="button arrow" disabled>
         <span class="icon is-small">
            <i class="fas fa-arrow-left" />
         </span>
      </button>
   {/if}
   {#if page < maxPages}
      <button on:click={() => pageClicked(page + 1)} class="button arrow">
         <span class="icon is-small">
            <i class="fas fa-arrow-right" />
         </span>
      </button>
   {:else}
      <button class="button arrow" disabled>
         <span class="icon is-small">
            <i class="fas fa-arrow-right" />
         </span>
      </button>
   {/if}
</nav>

<style>
   .pagination .button {
      background-color: #2d2d2d !important;
      border-color: var(--foreground) !important;
      color: var(--alternate) !important;
      display: flex;
   }
   .pagination .button:hover {
      color: var(--scoreSaberYellow) !important;
   }
   .pagination {
      margin-bottom: 0.1rem;
   }
</style>
