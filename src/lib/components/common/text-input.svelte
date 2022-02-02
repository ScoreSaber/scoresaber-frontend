<script lang="ts">
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';

   export let value: string = null;
   export let placeholder: string = 'Search...';
   export let onInput: (value: string) => void = () => {};
   export let isSmall: boolean = false;
   export let icon: string = null;

   export let expandable: boolean = false;
   export let expanded: boolean = false;

   let inputElement: HTMLInputElement = null;
   let container: HTMLDivElement = null;

   let timeout = null;

   function forwardInput() {
      $requestCancel.cancel('Input Changed');
      updateCancelToken();
      if (value === '') value = null;
      onInput(value);
   }

   function onChange() {
      if (timeout) {
         clearTimeout(timeout);
      }
      timeout = setTimeout(forwardInput, 1000);
   }

   function onKeyDown(e: KeyboardEvent) {
      if (timeout) {
         clearTimeout(timeout);
         timeout = null;
      }
      if (e.key === 'Enter') {
         forwardInput();
      }
   }

   function clearSearch() {
      $requestCancel.cancel('Input Changed');
      updateCancelToken();
      value = null;
      onInput(value);
   }

   function handleClick() {
      if (expandable) {
         expanded = !expanded;
         if (expanded && inputElement) inputElement.focus();
      } else {
         $requestCancel.cancel('Input Changed');
         updateCancelToken();
         onInput(value);
      }
   }

   function clickOut(e: MouseEvent) {
      if (expandable && expanded && !container?.contains(e.target as Node)) {
         expanded = false;
      }
   }
</script>

<svelte:window on:click={clickOut} />

<div bind:this={container} class={'ss-input ' + (isSmall === true ? 'is-small' : '')} class:expandable class:expanded class:active={value !== null}>
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
   .ss-input {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem;
      border-radius: 0.25rem;
      background-color: var(--foregroundItem);
      transition: max-width var(--transitionTime) ease-in-out;
      width: 100%;
      font-size: 1rem;
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
   .ss-input.is-small {
      padding: 0.2rem;
   }
</style>
