<script lang="ts" context="module">
   export interface onClicked {
      (): void;
   }
</script>

<script lang="ts">
   // SkyKiwi wuz here
   export let poggleable: boolean = false;
   export let isDisabled: boolean = false;
   export let size: string = 'is-small';

   export let onClicked: onClicked = null;
   export let title: string;
   export let icon: string;

   function onButtonClicked() {
      if (poggleable) {
         isDisabled = !isDisabled;
         if (onClicked) {
            onClicked();
         }
      }
   }

   //is-medium-small
</script>

<button on:click={() => onButtonClicked()} class="button {size}" disabled={isDisabled}>
   <span class="icon">
      <i class="fas fa-{icon}" />
   </span>
   <span>{title}</span>
</button>

<style>
   .button {
      font-size: 14px;
      height: 2.3em;
      line-height: 1;
      background-color: var(--foregroundItem);
      border-color: var(--foreground);
      border: transparent;
      color: #eeeeee;
      margin-left: 5px;
      margin-right: 5px;
   }
   .button:disabled {
      background-color: #174491;
      border-color: var(--foreground);
      color: white;
   }
</style>
