<script lang="ts">
   export let icon: string;
   export let disabled = false;

   $: fasIcon = `fas ${icon ?? ''}`;
</script>

<button class="arrow-btn" on:click {disabled}>
   <i class={fasIcon} />
</button>

<style>
   .arrow-btn {
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all var(--transitionTime) ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.5rem;
   }

   .arrow-btn:hover:not(:disabled) {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
      color: var(--scoreSaberYellow);
   }

   .arrow-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
   }

   .arrow-btn:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
   }
</style>
