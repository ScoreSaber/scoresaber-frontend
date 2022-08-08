<script lang="ts">
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';

   export let value: string = null;
   export let placeholder = 'Search...';
   export let onSearch: (value: string) => void = () => {};
   export let icon: string = null;

   export let expandable = false;
   export let expanded = false;

   let inputElement: HTMLInputElement = null;
   let searchContainer: HTMLDivElement = null;

   let searchTimout = null;

   function onChange() {
      if (searchTimout) {
         clearTimeout(searchTimout);
      }
      searchTimout = setTimeout(() => {
         $requestCancel.cancel('Search Changed');
         updateCancelToken();
         if (value === '') value = null;
         onSearch(value);
      }, 500);
   }

   function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
         onSearch(value);
      }
   }

   function clearSearch() {
      $requestCancel.cancel('Search Changed');
      updateCancelToken();
      value = null;
      onSearch(value);
   }

   function handleClick() {
      if (expandable) {
         expanded = !expanded;
         if (expanded && inputElement) inputElement.focus();
      } else {
         $requestCancel.cancel('Search Changed');
         updateCancelToken();
         onSearch(value);
      }
   }

   function clickOut(e: MouseEvent) {
      if (expandable && expanded && !searchContainer?.contains(e.target as Node)) {
         expanded = false;
      }
   }
</script>

<svelte:window on:click={clickOut} />

<div bind:this={searchContainer} class="searchInput" class:expandable class:expanded class:active={value !== null}>
   {#if icon}
      <i on:click={handleClick} class="fas {icon}" />
   {/if}
   <div>
      <input bind:this={inputElement} type="text" bind:value {placeholder} on:input={onChange} on:keydown={onKeyDown} />
      <div class="active" />
   </div>
   {#if value}
      <div class="clear" on:click={clearSearch}>X</div>
   {/if}
</div>

<style lang="scss">
   .searchInput {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem;
      border-radius: 0.25rem;
      background-color: var(--foregroundItem);
      transition: max-width var(--transitionTime) ease-in-out;
      width: 100%;
      font-size: 1rem;
      color: #fff;
      &.expandable {
         max-width: calc(16px + 1rem);
         &.expanded {
            max-width: 100%;
         }
      }
      > div {
         position: relative;
         width: 100%;
      }
      i {
         margin-right: 0.25rem;
         transition: color var(--transitionTime) ease-out;
         &:hover {
            cursor: pointer;
         }
      }
      input {
         background-color: transparent;
         border: none;
         color: inherit;
         width: 100%;
         &:focus {
            outline: none;
         }
      }
      .active {
         width: 0;
         position: absolute;
         bottom: 0;
         left: 0;
         height: 0.1rem;
         background-color: var(--scoreSaberYellow);
         transition: width calc(var(--transitionTime) / 2) ease-in-out;
      }
      &:focus-within,
      &.active {
         .active {
            width: 100%;
         }
         i {
            color: var(--scoreSaberYellow);
         }
      }
      .clear {
         color: var(--danger);
         flex: 0;
         margin: 0 5px;
         &:hover {
            cursor: pointer;
         }
      }
   }
</style>
