<script lang="ts">
   export let icon: string;
   export let size = 'is-small';
   export let disabled = false;

   $: iconSize = `icon ${size ?? ''}`;
   $: fasIcon = `fas ${icon ?? ''}`;
</script>

<button class="button" on:click {disabled}>
   <span class={iconSize}>
      <i class={fasIcon} />
   </span>
</button>

<style>
   button {
      background-color: #2d2d2d !important;
      border-color: var(--foreground) !important;
      color: var(--alternate) !important;
      display: flex;
   }

   button:hover {
      color: var(--scoreSaberYellow) !important;
   }
</style>
