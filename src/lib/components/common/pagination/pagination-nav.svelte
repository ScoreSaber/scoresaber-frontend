<script type="ts">
   /**
    * Credits go to @TahaSh from the original svelte-paginate library.
    */

   import { createEventDispatcher } from 'svelte';

   import generateNavigationOptions, { PaginationOptions } from './generateNavigationOptions';

   const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
   const NEXT_PAGE = 'NEXT_PAGE';
   const ELLIPSIS = 'ELLIPSIS';

   const dispatch = createEventDispatcher();

   export let totalItems = 0;
   export let pageSize = 1;
   export let currentPage = 1;
   export let limit: number = null;
   export let showStepOptions = false;

   $: options = generateNavigationOptions({
      totalItems,
      pageSize,
      currentPage,
      limit,
      showStepOptions
   });

   $: totalPages = Math.ceil(totalItems / pageSize);

   function isOptionDisabled(option: PaginationOptions): boolean {
      return (
         (option.type === 'symbol' && option.symbol === NEXT_PAGE && currentPage >= totalPages) ||
         (option.type === 'symbol' && option.symbol === PREVIOUS_PAGE && currentPage <= 1)
      );
   }

   function handleOptionClick(option) {
      if (isOptionDisabled(option) || option.value === currentPage || (option.type === 'symbol' && option.symbol === ELLIPSIS)) {
         return;
      }
      dispatch('setPage', { page: option.value });
   }
</script>

<div class="pagination-nav">
   {#each options as option}
      <span
         class="option"
         class:number={option.type === 'number'}
         class:prev={option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}
         class:next={option.type === 'symbol' && option.symbol === NEXT_PAGE}
         class:disabled={isOptionDisabled(option)}
         class:ellipsis={option.type === 'symbol' && option.symbol === ELLIPSIS}
         class:active={option.type === 'number' && option.value == currentPage}
         on:click={() => handleOptionClick(option)}
      >
         {#if option.type === 'number'}
            <slot name="number" value={option.value}>
               <span>{option.value}</span>
            </slot>
         {:else if option.type === 'symbol' && option.symbol === ELLIPSIS}
            <slot name="ellipsis">
               <span>...</span>
            </slot>
         {:else if option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}
            <slot name="prev">
               <i class="fas fa-angle-left" />
            </slot>
         {:else if option.type === 'symbol' && option.symbol === NEXT_PAGE}
            <slot name="next">
               <i class="fas fa-angle-right" />
            </slot>
         {/if}
      </span>
   {/each}
</div>
