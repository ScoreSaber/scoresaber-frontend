<script lang="ts">
   import { slide } from 'svelte/transition';
   import { browser } from '$app/env';
   import Autocomplete from './autocomplete.svelte';
   import Chip from './chip.svelte';
   import { onDestroy, onMount } from 'svelte';
   import type { FilterItem } from '$lib/models/Filter';
   export let filterName: string;
   export let items: FilterItem[];
   export let initialItems: string = undefined;
   export let withCountryImages: boolean = false;
   export let filterUpdated = (items: FilterItem[]) => {};

   $: selectedItems = [];
   $: expanded = false;

   let input: HTMLInputElement;
   let newOption: string = '';
   let chip: HTMLDivElement;
   $: input && focusInput();

   function addItemByKey(item: string, notify: boolean = true) {
      const filterItem = items.find((x) => x.key.toLowerCase() === item.toLowerCase());
      if (filterItem) {
         addItem(filterItem, notify);
      }
   }

   function addItemByFriendlyName(item: string, notify: boolean = true) {
      const filterItem = items.find((x) => x.friendlyName.toLowerCase() === item.toLowerCase());
      if (filterItem) {
         addItem(filterItem, notify);
      }
   }

   function addItem(item: FilterItem, notify: boolean) {
      items = items.filter((x) => x !== item);
      selectedItems = [...selectedItems, item];
      expanded = false;
      if (notify) {
         filterUpdated(selectedItems);
      }
   }

   function removeItem(item: FilterItem, notify: boolean = true) {
      selectedItems = selectedItems.filter((x) => x !== item);
      items = [item, ...items];
      if (notify) {
         filterUpdated(selectedItems);
      }
   }

   onMount(() => {
      if (browser) {
         document.addEventListener('click', checkChipClick);
         document.addEventListener('keydown', checkKeyDown);
         if (initialItems) {
            for (const item of initialItems.split(',')) {
               addItemByKey(item, false);
            }
         }
      }
   });

   onDestroy(() => {
      if (browser) {
         document.removeEventListener('click', checkChipClick);
         document.removeEventListener('keydown', checkKeyDown);
      }
   });

   function checkKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
         if (newOption !== '') {
            addItemByFriendlyName(newOption);
            newOption = '';
         }
      } else if (e.key === 'Escape') {
         expanded = false;
      }
   }

   function checkChipClick(e: MouseEvent) {
      if (chip && !chip.contains(e.target as Node)) {
         expanded = false;
      }
   }

   function focusInput() {
      if (expanded) input.focus();
   }
</script>

<div class="filter-container">
   {#if selectedItems.length > 0}
      {#each selectedItems as option}
         <Chip item={option} remove={removeItem} {withCountryImages} />
      {/each}
   {/if}
   {#if items.length > 0}
      <div class="filter" bind:this={chip} class:expanded class:hasSelected={selectedItems.length > 0}>
         {#if expanded}
            <div transition:slide|local={{ duration: 300 }}>
               <Autocomplete
                  options={items}
                  valueSelected={() => addItemByFriendlyName(newOption)}
                  bind:elementRef={input}
                  bind:value={newOption}
                  placeholder={`Add ${filterName}`}
                  showAll={true}
               />
            </div>
         {:else}
            <div transition:slide|local={{ duration: 300 }} class="addLabel" on:click={() => (expanded = !expanded)}>
               {#if selectedItems.length > 0}
                  + Add
               {:else}
                  Filter By {filterName}
               {/if}
            </div>
         {/if}
      </div>
   {/if}
</div>

<style>
   .filter-container {
      display: flex;
      flex-flow: row wrap;
   }
   .filter {
      margin: 5px;
      background-color: var(--foregroundItem);
      transition: background-color var(--transitionTime), width var(--transitionTime), max-width var(--transitionTime);
      padding: 5px 12px;
      border-radius: 7px;
      position: relative;
      font-weight: bold;
      max-width: 130px;
      white-space: nowrap;
   }
   .hasSelected {
      max-width: 70px;
   }
   .filter.expanded {
      max-width: 200px;
   }
   .filter:hover {
      background-color: #323232;
      cursor: pointer;
   }
</style>