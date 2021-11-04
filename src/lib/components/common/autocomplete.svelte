<script lang="ts">
   export let placeholder: string = '';
   export let value: string = '';
   export let classes: string = '';
   export let elementRef: HTMLElement;
   export let options: string[] = [];
   export let valueSelected: (value: string) => void = () => {};

   $: filteredOptions = options.filter((x) => x.toLowerCase().includes(value.toLowerCase()));

   function selectOption(option: string) {
      value = option;
      valueSelected(value);
   }
</script>

<div>
   <input type="text" bind:this={elementRef} class={classes} bind:value {placeholder} />
   {#if options.length > 0 && value.length > 0}
      <div class="options">
         {#each filteredOptions as option}
            <div class="option" on:click={() => selectOption(option)}>
               {option}
            </div>
         {/each}
      </div>
   {/if}
</div>

<style>
   div {
      position: relative;
   }
   input {
      background-color: transparent;
      border: none;
      color: inherit;
      border-bottom: 1px solid;
      width: 100%;
   }
   input:focus {
      outline: none;
      border-bottom: 2px solid #fff;
   }
   .options {
      position: absolute;
      width: 100%;
      padding: 5px;
      background-color: var(--gray-dark);
      border-radius: 0 0 5px 5px;
   }
   .options .option {
      padding: 5px;
      cursor: pointer;
      border-radius: 7px;
   }
   .options .option:hover {
      background-color: var(--gray-light);
   }
</style>
