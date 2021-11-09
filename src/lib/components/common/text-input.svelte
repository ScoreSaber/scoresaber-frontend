<script lang="ts">
   export let placeholder: string = '';
   export let value: string = '';
   export let classes: string = '';
   export let elementRef: HTMLElement;
</script>

<input type="text" bind:this={elementRef} class={classes} bind:value {placeholder} />

<style>
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
</style>
