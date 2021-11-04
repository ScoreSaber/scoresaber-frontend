<script lang="ts">
   export let placeholder: string = '';
   export let value: string = '';
</script>

<input type="text" bind:value {placeholder} />

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
