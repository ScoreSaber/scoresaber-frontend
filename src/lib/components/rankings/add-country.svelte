<script lang="ts">
   import TextInput from '../common/text-input.svelte';

   export const addCountry = (country: string) => {};

   let expanded = false;
   let chip: HTMLElement;
   let input;

   document.addEventListener('click', checkChipClick);

   function checkChipClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).classList.contains('addCountry')) {
         expanded = false;
      }
   }

   function toggleExpand() {
      expanded = !expanded;
   }

   $: input && focusInput();

   function focusInput() {
      if (expanded) input.focus();
   }
</script>

<div class="country addCountry" bind:this={chip}>
   {#if expanded}
      <TextInput bind:elementRef={input} classes="addCountry" placeholder="Add Country" />
   {:else}
      <div class="addLabel addCountry" on:click={toggleExpand}>+ Add</div>
   {/if}
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
      max-width: 150px;
   }
   .country:hover {
      background-color: #323232;
      cursor: pointer;
   }
</style>
