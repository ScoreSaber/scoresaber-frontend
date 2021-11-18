<script lang="ts" context="module">
   export interface buttonGroupItem {
      label: string;
      icon?: string;
      value: string;
   }
</script>

<script lang="ts">
   import Button from './button.svelte';

   export let onUpdate: (value: buttonGroupItem) => void = null;
   export let options: buttonGroupItem[];
   export let selected: buttonGroupItem = null;

   function handleClick(value: buttonGroupItem) {
      if (value !== selected) {
         selected = value;
         if (onUpdate) onUpdate(value);
      }
   }
</script>

<div class="btn-group">
   {#each options as option}
      <Button
         title={option.label}
         icon={option.icon}
         size=""
         poggleable={true}
         onClicked={() => handleClick(option)}
         isDisabled={selected === option}
      />
   {/each}
</div>

<style>
   .btn-group {
      display: flex;
      gap: 5px;
   }
</style>
