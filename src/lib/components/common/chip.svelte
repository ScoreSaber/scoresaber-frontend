<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';

   import type { FilterItem } from '$lib/models/Filter';
   export let item: FilterItem;
   export let remove: (value: FilterItem) => void;
   export let withCountryImages = false;
</script>

<div class="chip">
   {#if withCountryImages}
      <CountryImage country={item.key} />
   {/if}
   {item.friendlyName}
   <span class="remove" on:click={() => remove(item)} on:keydown={(e) => e.key === 'Enter' && remove(item)}> x </span>
</div>

<style>
   .chip {
      margin: 5px;
      background-color: var(--foregroundItem);
      transition: background-color var(--transitionTime);
      padding: 5px 12px;
      border-radius: 7px;
      position: relative;
      font-weight: bold;
   }
   .chip .remove {
      visibility: none;
      color: red;
      padding: 1px 8px;
      border-radius: 50%;
      background-color: var(--borderColor);
      opacity: 0;
      transition: opacity var(--transitionTime), visibility 0s;
      position: absolute;
      top: 0px;
      right: 0px;
      transform: translate(50%, -50%);
   }
   .chip .remove:hover {
      cursor: pointer;
   }
   .chip:hover {
      background-color: #323232;
   }
   .chip:hover .remove {
      visibility: visible;
      opacity: 1;
   }
   @media only screen and (max-width: 769px) {
      .chip .remove {
         visibility: visible;
         opacity: 1;
      }
   }
</style>
