<script lang="ts">
   import Button from './button.svelte';

   export let title: string;
   export let message: string;
   export let onConfirm: () => void;
   export let onCancel: () => void;
</script>

<div class="modal-content">
   <div class="modal-header">
      <h5 class="title is-5">{title}</h5>
   </div>
   <div class="modal-body">
      <p>{message}</p>
   </div>
   <div class="modal-footer">
      <Button title="Cancel" onClicked={onCancel} size="is-small" icon="door-open" />
      <Button title="Dismiss" onClicked={onConfirm} size="is-small" icon="times" />
   </div>
</div>

<style>
   .modal-content {
      padding: 1rem;
   }

   .modal-header {
      margin-bottom: 1rem;
   }

   .modal-body {
      margin-bottom: 1.5rem;
   }

   .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
   }
</style>
