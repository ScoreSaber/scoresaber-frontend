<script lang="ts">
   import type { Writable } from 'svelte/store';

   import { onDestroy, onMount, getContext } from 'svelte';

   import { browser } from '$app/env';

   import Autocomplete from '$lib/components/common/autocomplete.svelte';
   import Chip from '$lib/components/common/chip.svelte';

   import type { FilterItem } from '$lib/models/Filter';

   import { FILTER_CONTEXT_KEY } from './filter-context';

   export let filterName: string;
   export let items: FilterItem[];
   export let initialItems: string | undefined = undefined;
   export let withCountryImages = false;
   export let filterUpdated: (items: FilterItem[]) => void;
   export let selectedItems: FilterItem[] = [];

   let input: HTMLInputElement | null = null;
   let newOption = '';
   let container: HTMLDivElement | null = null;
   let filterId = '';

   const expandedFilterStore = getContext<Writable<string | null>>(FILTER_CONTEXT_KEY);

   $: isExpanded = filterId !== '' && $expandedFilterStore === filterId;

   $: selectedKeys = new Set(selectedItems.map((item) => item.key));
   $: availableItems = items.filter((item) => !selectedKeys.has(item.key));

   $: if (isExpanded && input && browser) {
      input.focus();
   }

   function expandFilter(e: MouseEvent): void {
      e.stopPropagation();
      if (filterId) {
         expandedFilterStore.set(filterId);
      }
   }

   function collapseFilter(): void {
      if ($expandedFilterStore === filterId) {
         expandedFilterStore.set(null);
      }
   }

   function addItem(item: FilterItem, notify: boolean): void {
      if (selectedItems.some((selected) => selected.key === item.key)) return;

      selectedItems = [...selectedItems, item];
      collapseFilter();
      newOption = '';

      if (notify) {
         filterUpdated(selectedItems);
      }
   }

   function removeItem(item: FilterItem, notify = true): void {
      selectedItems = selectedItems.filter((selected) => selected.key !== item.key);

      if (notify) {
         filterUpdated(selectedItems);
      }
   }

   function handleClickOutside(e: MouseEvent): void {
      if (container && isExpanded && !container.contains(e.target as Node)) {
         collapseFilter();
      }
   }

   function initializeSelectedItems(): void {
      if (!initialItems) return;

      const itemKeys = initialItems
         .split(',')
         .map((key) => key.trim())
         .filter(Boolean);

      const itemsToAdd: FilterItem[] = [];

      for (const key of itemKeys) {
         const item = items.find((x) => x.key.toLowerCase() === key.toLowerCase());
         if (item && !selectedItems.some((s) => s.key === item.key)) {
            itemsToAdd.push(item);
         }
      }

      if (itemsToAdd.length > 0) {
         selectedItems = [...selectedItems, ...itemsToAdd];
         filterUpdated(selectedItems);
      }
   }

   onMount(() => {
      if (!browser) {
         filterId = `${filterName}-${Math.random().toString(36).substr(2, 9)}`;
         return;
      }

      filterId = `${filterName}-${Math.random().toString(36).substr(2, 9)}`;

      document.addEventListener('click', handleClickOutside);
      initializeSelectedItems();
   });

   onDestroy(() => {
      if (browser) {
         document.removeEventListener('click', handleClickOutside);
         collapseFilter();
      }
   });
</script>

<div class="filter-container" bind:this={container}>
   {#each selectedItems as option (option.key)}
      <Chip item={option} remove={removeItem} {withCountryImages} />
   {/each}
   {#if availableItems.length > 0}
      <div class="filter-button" class:expanded={isExpanded} class:has-selected={selectedItems.length > 0}>
         {#if isExpanded}
            <Autocomplete
               options={availableItems}
               valueSelected={(item) => addItem(item, true)}
               bind:elementRef={input}
               bind:value={newOption}
               placeholder={`Add ${filterName}`}
               showAll={true}
            />
         {:else}
            <button
               class="add-button"
               on:click={expandFilter}
               type="button"
               aria-label={selectedItems.length > 0 ? `Add ${filterName}` : `Filter by ${filterName}`}
            >
               {selectedItems.length > 0 ? '+ Add' : `Filter By ${filterName}`}
            </button>
         {/if}
      </div>
   {/if}
</div>

<style>
   .filter-container {
      display: flex;
      flex-flow: row wrap;
      gap: 0.375rem;
      align-items: center;
      position: relative;
   }

   .filter-button {
      position: relative;
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      padding: 0.375rem 0.625rem;
      border-radius: 6px;
      font-weight: 500;
      font-size: 0.875rem;
      white-space: nowrap;
      transition: all var(--transitionTime) ease;
      overflow: visible;
      min-width: fit-content;
   }

   .filter-button.has-selected {
      max-width: 4.5rem;
   }

   .filter-button.expanded {
      max-width: 16rem;
      z-index: 100;
      background-color: var(--foregroundItem);
      border-color: var(--scoreSaberYellow);
   }

   .filter-button:hover:not(.expanded) {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
   }

   .add-button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.9);
      font: inherit;
      padding: 0;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-weight: inherit;
      white-space: nowrap;
      font-size: inherit;
   }

   .add-button:hover {
      color: rgba(255, 255, 255, 1);
   }

   .add-button:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: -2px;
      border-radius: 0.375rem;
   }
</style>
