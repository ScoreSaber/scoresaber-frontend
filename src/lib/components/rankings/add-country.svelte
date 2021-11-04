<script lang="ts">
   import { slide } from 'svelte/transition';
   import Autocomplete from '../common/autocomplete.svelte';
   import { useAccio } from '$lib/utils/accio';
   import queryString from 'query-string';
   import axios from '$lib/utils/fetcher';
   export let addCountry = (country: string) => {};
   export let selectedCountries: string[] = [];

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

   let temp = ['AU', 'GB', 'US', 'UK', 'CA'];

   const {
      data: countrySearch,
      error: countrySearchError,
      refresh: refreshCountrySearch
   } = useAccio<{ Name: string; Code: string }[]>(
      queryString.stringifyUrl({
         url: 'https://datahub.io/core/country-list/r/data.json'
      }),
      { fetcher: axios }
   );

   $: options = ($countrySearch ?? [])
      .map((x) => {
         return {
            label: x.Name,
            value: x.Code
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
