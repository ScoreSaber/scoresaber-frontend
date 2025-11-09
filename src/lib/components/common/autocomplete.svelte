<script lang="ts">
   import type { FilterItem } from '$lib/models/Filter';

   export let placeholder = '';
   export let value: string;
   export let classes = '';
   export let elementRef: HTMLInputElement | null = null;
   export let options: FilterItem[] = [];
   export let valueSelected: (value: FilterItem) => void;
   export let showAll = false;

   let highlighted = 0;
   let optionsElement: HTMLDivElement | null = null;

   $: searchTerm = value.toLowerCase();
   $: filteredOptions =
      value === '' && showAll
         ? options
         : options.filter((item) => {
              const friendlyName = item.friendlyName?.toLowerCase() ?? '';
              const key = item.key?.toLowerCase() ?? '';
              return friendlyName.includes(searchTerm) || key.includes(searchTerm);
           });

   $: if (filteredOptions.length > 0 && highlighted >= filteredOptions.length) {
      highlighted = 0;
   }

   $: isOpen = filteredOptions.length > 0 && (showAll || value !== '');

   function selectOption(option: FilterItem): void {
      valueSelected?.(option);
      value = '';
      highlighted = 0;
   }

   function scrollToHighlighted(): void {
      if (!optionsElement) return;
      const el = optionsElement.children[highlighted] as HTMLElement;
      if (el) {
         const containerRect = optionsElement.getBoundingClientRect();
         const elRect = el.getBoundingClientRect();
         if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
            optionsElement.scrollTop = el.offsetTop - 40;
         }
      }
   }

   function handleKeyDown(e: KeyboardEvent): void {
      if (!optionsElement || filteredOptions.length === 0) return;
      if (e.key === 'ArrowDown') {
         e.preventDefault();
         highlighted = (highlighted + 1) % filteredOptions.length;
         scrollToHighlighted();
      } else if (e.key === 'ArrowUp') {
         e.preventDefault();
         highlighted = highlighted <= 0 ? filteredOptions.length - 1 : highlighted - 1;
         scrollToHighlighted();
      } else if (e.key === 'Enter') {
         e.preventDefault();
         const option = filteredOptions[highlighted];
         if (option) selectOption(option);
      } else if (e.key === 'Escape') {
         value = '';
         highlighted = 0;
      }
   }
</script>

<div class="autocomplete" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-controls={isOpen ? 'autocomplete-options' : undefined}>
   <input
      type="text"
      on:keydown={handleKeyDown}
      bind:this={elementRef}
      class={classes}
      bind:value
      {placeholder}
      aria-autocomplete="list"
      aria-controls="autocomplete-options"
      aria-activedescendant={isOpen && filteredOptions[highlighted] ? `option-${highlighted}` : undefined}
   />
   {#if isOpen && filteredOptions.length > 0}
      <div id="autocomplete-options" class="options" bind:this={optionsElement} role="listbox" aria-label="Filter options">
         {#each filteredOptions as option, i (option.key)}
            <div
               id={`option-${i}`}
               class="option"
               class:highlight={highlighted === i}
               on:click={() => selectOption(option)}
               on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), selectOption(option))}
               on:mouseenter={() => (highlighted = i)}
               tabindex="-1"
               role="option"
               aria-selected={highlighted === i}
            >
               {option.friendlyName}
            </div>
         {/each}
      </div>
   {/if}
</div>

<style>
   .autocomplete {
      position: relative;
      width: 100%;
      z-index: 100;
   }

   input {
      background-color: transparent;
      border: none;
      color: inherit;
      border-bottom: 1px solid var(--borderColor);
      width: 100%;
      padding: 2px 0;
      font-size: inherit;
      font-family: inherit;
      transition: border-bottom-color var(--transitionTime) ease;
   }

   input:focus {
      outline: none;
      border-bottom: 2px solid var(--scoreSaberYellow);
   }

   input::placeholder {
      color: rgba(255, 255, 255, 0.5);
   }

   .options {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      width: 100%;
      padding: 4px;
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-top: none;
      border-radius: 0 0 6px 6px;
      z-index: 200;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 300px;
      margin-top: 0;
   }

   .option {
      padding: 8px 10px;
      cursor: pointer;
      border-radius: 4px;
      white-space: normal;
      transition: background-color 0.15s ease;
      user-select: none;
   }

   .option:hover,
   .option.highlight {
      background-color: var(--gray-light);
   }

   .option:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: -2px;
   }

   .options::-webkit-scrollbar {
      width: 6px;
   }

   .options::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
   }

   .options::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
   }

   .options::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
   }
</style>
