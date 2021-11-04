<script lang="ts">
   import TextInput from '../common/text-input.svelte';

   export let addCountry = (country: string) => {};

   let expanded = false;
   let input: HTMLInputElement;
   let newCountry: string = '';

   document.addEventListener('click', checkChipClick);
   document.addEventListener('keydown', checkKeyDown);

   function checkChipClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).classList.contains('addCountry')) {
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
</script>

<div class="country addCountry">
   {#if expanded}
      <TextInput bind:elementRef={input} bind:value={newCountry} classes="addCountry" placeholder="Add Country" />
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
