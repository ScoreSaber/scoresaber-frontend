<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';

   export let country: string;
   export let remove = (country: string) => {};
</script>

<div class="country">
   <CountryImage {country} />
   {country.toUpperCase()}
   <span class="remove" on:click={() => remove(country)}> x </span>
</div>

<style>
   .country {
      margin: 5px;
      background-color: var(--foregroundItem);
      transition: background-color var(--transitionTime);
      padding: 5px 12px;
      border-radius: 7px;
      position: relative;
      font-weight: bold;
   }
   .country .remove {
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
   .country .remove:hover {
      cursor: pointer;
   }
   .country:hover {
      background-color: #323232;
   }
   .country:hover .remove {
      visibility: visible;
      opacity: 1;
   }
</style>
