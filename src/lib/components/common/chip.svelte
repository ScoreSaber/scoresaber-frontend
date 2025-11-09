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
   <button
      class="remove"
      on:click={() => remove(item)}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), remove(item))}
      aria-label={`Remove ${item.friendlyName}`}
      type="button"
   >
      <i class="fas fa-times" />
   </button>
</div>

<style>
   .chip {
      margin: 0;
      background-color: var(--foregroundItem);
      padding: 5px 12px;
      border-radius: 7px;
      position: relative;
      font-weight: bold;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background-color var(--transitionTime) ease;
   }

   .chip:hover {
      background-color: #323232;
   }

   .remove {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      width: 18px;
      height: 18px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background-color: var(--borderColor);
      color: rgba(255, 255, 255, 0.8);
      font-size: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(50%, -50%);
      transition: opacity var(--transitionTime) ease, background-color var(--transitionTime) ease, visibility 0s var(--transitionTime);
   }

   .remove:hover,
   .remove:focus-visible {
      background-color: rgba(220, 53, 69, 0.9);
      color: white;
      outline: none;
   }

   .chip:hover .remove {
      visibility: visible;
      opacity: 1;
      transition: opacity var(--transitionTime) ease, background-color var(--transitionTime) ease, visibility 0s 0s;
   }

   @media only screen and (max-width: 769px) {
      .remove {
         visibility: visible;
         opacity: 1;
         transition: opacity var(--transitionTime) ease, background-color var(--transitionTime) ease, visibility 0s 0s;
      }
   }
</style>
