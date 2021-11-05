<script lang="ts">
   import { slide } from 'svelte/transition';
   import Autocomplete from '../common/autocomplete.svelte';
   import type { countryData } from '$lib/models/CountryData';
   import { onDestroy, onMount } from 'svelte';
   export let addCountry = (country: string) => {};
   export let selectedCountries: string[] = [];
   export let countryData: countryData[] = [];

   let expanded = false;
   let input: HTMLInputElement;
   let newCountry: string = '';
   let chip: HTMLDivElement;

   onMount(() => {
      document.addEventListener('click', checkChipClick);
      document.addEventListener('keydown', checkKeyDown);
   });

   onDestroy(() => {
      document.removeEventListener('click', checkChipClick);
      document.removeEventListener('keydown', checkKeyDown);
   });

   function checkChipClick(e: MouseEvent) {
      if (chip && !chip.contains(e.target as Node)) {
         expanded = false;
      }
   }

   function checkKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
         if (newCountry !== '') {
            addCountry(newCountry);
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

   $: options = (countryData ?? [])
      .map((x) => {
         return {
            label: `${x.name} (${x['alpha-2']})`,
            value: x['alpha-2']
         };
      })
      .filter((x) => !selectedCountries.includes(x.value));
</script>

<div class="country" bind:this={chip} class:expanded class:hasSelected={selectedCountries.length > 0}>
   {#if expanded}
      <div transition:slide={{ duration: 300 }}>
         <Autocomplete
            {options}
            valueSelected={() => addCountry(newCountry)}
            bind:elementRef={input}
            bind:value={newCountry}
            placeholder="Add Country"
            showAll={true}
         />
      </div>
   {:else}
      <div transition:slide={{ duration: 300 }} class="addLabel" on:click={toggleExpand}>
         {#if selectedCountries.length > 0}
            + Add
         {:else}
            Filter By Country
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
      max-width: 130px;
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
