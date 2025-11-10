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
      border: 1px solid var(--borderColor);
      padding: 0.375rem 0.625rem;
      border-radius: 6px;
      position: relative;
      font-weight: 500;
      font-size: 0.875rem;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      transition: all var(--transitionTime) ease;
   }

   .chip:hover {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
   }

   .remove {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      top: 0;
      right: 0;
      width: 16px;
      height: 16px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background-color: rgba(220, 53, 69, 0.9);
      color: white;
      font-size: 9px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(50%, -50%);
      transition: all var(--transitionTime) ease;
   }

   .remove:hover,
   .remove:focus-visible {
      background-color: rgba(220, 53, 69, 1);
      transform: translate(50%, -50%) scale(1.1);
      outline: none;
   }

   .chip:hover .remove {
      visibility: visible;
      opacity: 1;
   }

   @media only screen and (max-width: 768px) {
      .remove {
         visibility: visible;
         opacity: 1;
      }
   }
</style>
