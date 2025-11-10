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

   let showInput = false;
   let inputValue = '';
   let inputElement: HTMLInputElement;

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
      if (isOptionDisabled(option) || option.value === currentPage) {
         return;
      }
      if (option.type === 'symbol' && option.symbol === ELLIPSIS) {
         showInput = true;
         inputValue = '';
         setTimeout(() => inputElement?.focus(), 0);
         return;
      }
      dispatch('setPage', { page: option.value });
   }

   function handleInputSubmit() {
      const page = parseInt(inputValue, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
         dispatch('setPage', { page });
         showInput = false;
         inputValue = '';
      }
   }

   function handleInputKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
         handleInputSubmit();
      } else if (e.key === 'Escape') {
         showInput = false;
         inputValue = '';
      }
   }

   function handleInputBlur() {
      setTimeout(() => {
         showInput = false;
         inputValue = '';
      }, 200);
   }
</script>

<div class="pagination-nav">
   {#if showInput}
      <div class="page-input-container">
         <input
            bind:this={inputElement}
            bind:value={inputValue}
            on:keydown={handleInputKeydown}
            on:blur={handleInputBlur}
            type="number"
            min="1"
            max={totalPages}
            placeholder="Page"
            class="page-input"
         />
         <button on:click={handleInputSubmit} class="go-button">Go</button>
      </div>
   {:else}
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
            on:keydown={(e) => e.key === 'Enter' && handleOptionClick(option)}
            tabindex="0"
            role="button"
         >
            {#if option.type === 'number'}
               <slot name="number" value={option.value}>
                  <span>{option.value.toLocaleString()}</span>
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
   {/if}
</div>

<style>
   .page-input-container {
      display: flex;
      gap: 0.5rem;
      align-items: center;
   }

   .page-input {
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border-radius: 6px;
      width: 80px;
      height: 2.5rem;
      box-sizing: border-box;
      text-align: center;
   }

   .page-input:focus {
      outline: 2px solid var(--scoreSaberYellow);
      outline-offset: 0;
      border-color: var(--scoreSaberYellow);
   }

   .page-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
      opacity: 1;
   }

   .go-button {
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transitionTime) ease;
      height: 2.5rem;
      min-width: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .go-button:hover {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
      color: var(--scoreSaberYellow);
   }

   .go-button:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
   }

   /* Remove number input arrows */
   .page-input::-webkit-outer-spin-button,
   .page-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
   }

   .page-input[type='number'] {
      -moz-appearance: textfield;
      appearance: textfield;
   }
</style>
