<script lang="ts">
   import { onDestroy, onMount } from 'svelte';

   import { browser } from '$app/env';

   import Autocomplete from '$lib/components/common/autocomplete.svelte';
   import Chip from '$lib/components/common/chip.svelte';

   import type { FilterItem } from '$lib/models/Filter';

   export let filterName: string;
   export let items: FilterItem[];
   export let initialItems: string | undefined = undefined;
   export let withCountryImages = false;
   export let filterUpdated: (items: FilterItem[]) => void;
   export let selectedItems: FilterItem[] = [];

   let expanded = false;
   let input: HTMLInputElement | null = null;
   let newOption = '';
   let container: HTMLDivElement | null = null;

   $: availableItems = items.filter((item) => !selectedItems.some((selected) => selected.key === item.key));

   $: if (expanded && input && browser) input.focus();

   function addItem(item: FilterItem, notify: boolean): void {
      selectedItems = [...selectedItems, item];
      expanded = false;
      newOption = '';
      if (notify) filterUpdated(selectedItems);
   }

   function removeItem(item: FilterItem, notify = true): void {
      selectedItems = selectedItems.filter((x) => x.key !== item.key);
      if (notify) filterUpdated(selectedItems);
   }

   function handleClickOutside(e: MouseEvent): void {
      if (container && expanded && !container.contains(e.target as Node)) expanded = false;
   }

   onMount(() => {
      if (!browser) return;
      document.addEventListener('click', handleClickOutside);
      if (initialItems) {
         const itemKeys = initialItems
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);
         for (const key of itemKeys) {
            const item = items.find((x) => x.key.toLowerCase() === key.toLowerCase());
            if (item && !selectedItems.some((s) => s.key === item.key)) addItem(item, false);
         }
         if (itemKeys.length > 0) filterUpdated(selectedItems);
      }
   });

   onDestroy(() => {
      if (browser) document.removeEventListener('click', handleClickOutside);
   });
</script>

<div class="filter-container" bind:this={container}>
   {#each selectedItems as option (option.key)}
      <Chip item={option} remove={removeItem} {withCountryImages} />
   {/each}
   {#if availableItems.length > 0}
      <div class="filter" class:expanded class:has-selected={selectedItems.length > 0}>
         {#if expanded}
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
               class="add-label"
               on:click|stopPropagation={() => (expanded = true)}
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
      gap: 5px;
      align-items: center;
      margin-bottom: 5px;
   }

   .filter {
      background-color: var(--foregroundItem);
      padding: 5px 12px;
      border-radius: 7px;
      font-weight: bold;
      white-space: nowrap;
      transition: background-color var(--transitionTime) ease;
   }

   .filter.has-selected {
      max-width: 70px;
   }

   .filter.expanded {
      max-width: 200px;
   }

   .filter:hover:not(.expanded) {
      background-color: #323232;
   }

   .add-label {
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      padding: 0;
      width: 100%;
      text-align: left;
      cursor: pointer;
   }

   .add-label:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: -2px;
      border-radius: 7px;
   }
</style>
