<script lang="ts">
   export let region: string;
   export let remove = (region: string) => {};
</script>

<div class="region">
   {region}
   <span class="remove" on:click={() => remove(region)}> x </span>
</div>

<style>
   .region {
      margin: 5px;
      background-color: var(--foregroundItem);
      transition: background-color var(--transitionTime);
      padding: 5px 12px;
      border-radius: 7px;
      position: relative;
      font-weight: bold;
   }
   .region .remove {
      visibility: none;
      color: red;
      padding: 1px 8px;
      border-radius: 50%;
      background-color: var(--borderColor);
      opacity: 0;
      transition: opacity var(--transitionTime), visibility 0s;
      position: absolute;
      top: 0px;
      right: 0px;
      transform: translate(50%, -50%);
   }
   .region .remove:hover {
      cursor: pointer;
   }
   .region:hover {
      background-color: #323232;
   }
   .region:hover .remove {
      visibility: visible;
      opacity: 1;
   }
</style>
