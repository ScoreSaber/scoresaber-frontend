<script lang="ts">
   import { slide } from 'svelte/transition';
   import Autocomplete from '../common/autocomplete.svelte';
   import type { countryData } from '$lib/models/CountryData';
   export let addCountry = (country: string) => {};
   export let selectedCountries: string[] = [];
   export let countrySearch: countryData[] = [];

   let expanded = false;
   let input: HTMLInputElement;
   let newCountry: string = '';
   let chip: HTMLDivElement;

   document.addEventListener('click', checkChipClick);
   document.addEventListener('keydown', checkKeyDown);

   function checkChipClick(e: MouseEvent) {
      if (!chip.contains(e.target as Node)) {
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

   $: options = (countrySearch ?? [])
      .map((x) => {
         return {
            label: `${x.name} (${x['alpha-2']})`,
            value: x['alpha-2']
         };
      })
      .filter((x) => !selectedCountries.includes(x.value));
</script>

<div class="country" bind:this={chip} class:expanded>
   {#if expanded}
      <div transition:slide={{ duration: 300 }}>
         <Autocomplete
            {options}
            valueSelected={() => addCountry(newCountry)}
            bind:elementRef={input}
            bind:value={newCountry}
            placeholder="Add Country"
         />
      </div>
   {:else}
      <div transition:slide={{ duration: 300 }} class="addLabel" on:click={toggleExpand}>+ Add</div>
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
      max-width: 61px;
      width: auto;
   }
   .country.expanded {
      max-width: 150px;
   }
   .country:hover {
      background-color: #323232;
      cursor: pointer;
   }
</style>
