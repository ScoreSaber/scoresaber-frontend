<script lang="ts">
   export let value: string = '';
   export let placeholder: string = 'Search...';
   export let onSearch: (value: string) => void = () => {};
   export let icon: string = null;

   let searchTimout = null;

   function onChange() {
      if (searchTimout) {
         clearTimeout(searchTimout);
      }
      searchTimout = setTimeout(() => {
         if (value === '') value = null;
         onSearch(value);
      }, 500);
   }
</script>

<div class="searchInput">
   {#if icon}
      <i class="fas {icon}" />
   {/if}
   <div>
      <input type="text" bind:value {placeholder} on:input={onChange} />
      <div class="active" />
   </div>
</div>

<style lang="scss">
   .searchInput {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem;
      border-radius: 0.25rem;
      background-color: var(--foregroundItem);
      width: 100%;
      font-size: 1rem;
      > div {
         position: relative;
         width: 100%;
      }
      i {
         margin-right: 0.25rem;
         transition: color var(--transitionTime) ease-out;
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
      &:focus-within {
         .active {
            width: 100%;
         }
         i {
            color: var(--scoreSaberYellow);
         }
      }
   }
</style>
