<script lang="ts">
   import { slide } from 'svelte/transition';
   import Autocomplete from '../common/autocomplete.svelte';
   import type { countryData } from '$lib/models/CountryData';
   import { groupBy } from '$lib/utils/helpers';
   export let addRegion = (country: string) => {};
   export let selectedRegions: string[] = [];
   export let countryData: countryData[] = [];

   let expanded = false;
   let input: HTMLInputElement;
   let newCountry: string = '';
   let chip: HTMLDivElement;

   document.addEventListener('click', checkChipClick);
   document.addEventListener('keydown', checkKeyDown);

   function checkChipClick(e: MouseEvent) {
      if (chip && !chip.contains(e.target as Node)) {
         expanded = false;
      }
   }

   function checkKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
         if (newCountry !== '') {
            addRegion(newCountry);
            newCountry = '';
         }
      }
   }

   function toggleExpand() {
      expanded = !expanded;
   }

   $: input && focusInput();

   function focusInput() {
      if (expanded) input.focus();
   }
   $: regions = groupBy(countryData ?? [], 'region');
   $: options = Object.keys(regions ?? {}).filter((x) => x !== '' && !selectedRegions.includes(x));
</script>

<div class="country" bind:this={chip} class:expanded class:hasSelected={selectedRegions.length > 0}>
   {#if expanded}
      <div transition:slide={{ duration: 300 }}>
         <Autocomplete {options} valueSelected={() => addRegion(newCountry)} bind:elementRef={input} bind:value={newCountry} placeholder="Region" />
      </div>
   {:else}
      <div transition:slide={{ duration: 300 }} class="addLabel" on:click={toggleExpand}>
         {#if selectedRegions.length > 0}
            + Add
         {:else}
            Filter By Region
         {/if}
      </div>
   {/if}
</div>

<style>
   .country {
      margin: 5px;
      background-color: var(--foregroundItem);
      transition: background-color var(--transitionTime), width var(--transitionTime), max-width var(--transitionTime);
      padding: 5px 12px;
      border-radius: 7px;
      position: relative;
      font-weight: bold;
      max-width: 125px;
   }
   .hasSelected {
      max-width: 70px;
   }
   .country.expanded {
      max-width: 200px;
   }
   .country:hover {
      background-color: #323232;
      cursor: pointer;
   }
</style>
