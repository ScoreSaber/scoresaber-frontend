<script lang="ts">
   import type { FilterItem } from '$lib/models/Filter';

   export let placeholder = '';
   export let value: string;
   export let classes = '';
   export let elementRef: HTMLElement = null;
   export let options: FilterItem[] = [];
   export let valueSelected: (value: FilterItem) => void;
   export let showAll = false;

   let highlighted = 0;
   let optionsElement: HTMLDivElement;

   $: filteredOptions =
      value === '' && showAll
         ? options
         : (options as FilterItem[]).filter((x) =>
              x.friendlyName && x.key
                 ? x.friendlyName.toLowerCase().includes(value.toLowerCase()) || x.key.toLowerCase().includes(value.toLowerCase())
                 : x.friendlyName.toLowerCase().includes(value.toLowerCase())
           );

   function selectOption(option: FilterItem) {
      value = option.friendlyName;
      if (valueSelected) {
         valueSelected(option);
      }
      value = '';
   }

   function keydown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
         highlighted++;
      } else if (event.key === 'ArrowUp') {
         highlighted--;
      } else if (event.key === 'Enter') {
         let option = filteredOptions[highlighted];
         selectOption(option);
      }
      if (highlighted > filteredOptions.length - 1) {
         highlighted = 0;
      } else if (highlighted < 0) {
         highlighted = filteredOptions.length - 1;
      }
      optionsElement.scrollTop = (optionsElement.children[highlighted] as HTMLDivElement).offsetTop - 40;
   }
</script>

<div>
   <input type="text" on:keydown={keydown} bind:this={elementRef} class={classes} bind:value {placeholder} />
   {#if options.length > 0}
      <div class="options" bind:this={optionsElement}>
         {#each filteredOptions as option, i}
            <div class="option" class:highlight={highlighted === i} on:click={() => selectOption(option)}>
               {option.friendlyName}
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
      z-index: 5;
      overflow: auto;
      max-height: 0px;
      animation: showOptions var(--transitionTime) ease-in-out forwards;
      animation-delay: calc(var(--transitionTime) * 0.5);
   }
   .options .option {
      padding: 5px;
      cursor: pointer;
      border-radius: 7px;
      margin-top: 5px;
      white-space: normal;
   }
   .options .option:hover {
      background-color: var(--gray-light);
   }
   .options .option.highlight {
      background-color: var(--gray-light);
   }

   @keyframes showOptions {
      from {
         max-height: 0;
      }
      to {
         max-height: 400px;
      }
   }
</style>
