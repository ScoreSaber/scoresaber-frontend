<script lang="ts">
   import { fly } from 'svelte/transition';

   export let placeholder: string = '';
   export let value: string = '';
   export let classes: string = '';
   export let elementRef: HTMLElement;
   export let options: string[] | { label: string; value: string }[] = [];
   export let valueSelected: (value: string) => void = () => {};
   export let showAll: boolean = false;

   let highlighted: number = 0;
   let optionsElement: HTMLDivElement;
   let showOptions: boolean = false;

   $: filteredOptions =
      value === '' && showAll
         ? options
         : (options as any[]).filter((x) =>
              x.label && x.value
                 ? x.label.toLowerCase().includes(value.toLowerCase()) || x.value.toLowerCase().includes(value.toLowerCase())
                 : x.toLowerCase().includes(value.toLowerCase())
           );

   function selectOption(option: string) {
      value = option;
      valueSelected(value);
      value = '';
   }

   function keydown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
         highlighted++;
      } else if (event.key === 'ArrowUp') {
         highlighted--;
      } else if (event.key === 'Enter') {
         let option = filteredOptions[highlighted];
         selectOption(option.value ? option.value : option);
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
   <input
      type="text"
      on:focus={() => (showOptions = true)}
      on:blur={() => setTimeout(() => (showOptions = false))}
      on:keydown={keydown}
      bind:this={elementRef}
      class={classes}
      bind:value
      {placeholder}
   />
   {#if options.length > 0}
      <div class="options" bind:this={optionsElement}>
         {#each filteredOptions as option, i}
            {#if option.label && option.value}
               <div
                  in:fly={{ y: -60, delay: 60 * i, duration: 300 }}
                  class="option"
                  class:highlight={highlighted === i}
                  on:click={() => selectOption(option.value)}
               >
                  {option.label}
               </div>
            {:else}
               <div
                  in:fly={{ y: -60, delay: 60 * i, duration: 300 }}
                  class="option"
                  class:highlight={highlighted === i}
                  on:click={() => selectOption(option)}
               >
                  {option}
               </div>
            {/if}
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
      max-height: 400px;
   }
   .options .option {
      padding: 5px;
      cursor: pointer;
      border-radius: 7px;
   }
   .options .option:hover {
      background-color: var(--gray-light);
   }
   .options .option.highlight {
      background-color: var(--gray-light);
   }
</style>
