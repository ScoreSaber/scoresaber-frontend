<script lang="ts" context="module">
   export enum SaveStatus {
      Started,
      Completed
   }
   export interface SaveStatusUpdate {
      (status: SaveStatus, error?: string): void;
   }
</script>

<script lang="ts">
   import type { UserData } from '$lib/models/UserData';
   import type { Player } from '$lib/models/PlayerData';
   import RichText from '$lib/components/common/rich-text.svelte';
   import permissions from '$lib/utils/permissions';
   import poster from '$lib/utils/poster';
   import { fly } from 'svelte/transition';

   export let userData: UserData;
   export let player: Player;
   export let saveStatusUpdate: SaveStatusUpdate;

   $: editing = false;
   $: preview = false;
   let richTextValue = player.bio;

   async function submitBio() {
      saveStatusUpdate(SaveStatus.Started);
      editing = false;
      await poster(`/api/user/update-bio`, { bio: richTextValue }, { withCredentials: true });
      saveStatusUpdate(SaveStatus.Completed);
   }

   function togglePreview() {
      preview = !preview;
      editing = !editing;
   }

   function toggleEditing() {
      if (editing) {
         richTextValue = player.bio;
      }
      editing = !editing;
   }
</script>

{#if !userData}
   {#if player.bio}
      <div class="window-header">{player.name}'s bio</div>
      <div class="bio window has-shadow">
         {#if player.bio && !editing && !preview}
            {@html player.bio}
         {/if}
      </div>
   {/if}
{:else if permissions.checkPermissionNumber(player.permissions, permissions.security.PPFARMER)}
   {#if userData.playerId !== player.id}
      {#if player.bio}
         <div class="window-header">{player.name}'s bio</div>
         <div class="bio window has-shadow">
            {#if player.bio && !editing && !preview}
               {@html player.bio}
            {/if}
         </div>
      {/if}
   {:else}
      <div class="window-header">{player.name}'s bio</div>
      <div class="bio window has-shadow">
         <!-- No bio -->
         {#if !editing && !preview && !player.bio}
            <div in:fly={{ y: 20, duration: 1000 }} class="is-center">
               <h4>Your bio is currently empty</h4>
               <button on:click={toggleEditing} class="button is-info is-small ">
                  <span>Edit Bio</span>
               </button>
            </div>
         {/if}
         <!-- Has bio  -->
         {#if player.bio && !editing && !preview}
            {@html player.bio}
            {#if userData.playerId == player.id}
               <br />
               <button on:click={toggleEditing} class="button is-info is-small">
                  <span>Edit Bio</span>
               </button>
            {/if}
         {/if}
         <!-- Is editing bio -->
         {#if editing}
            <div class="editor" in:fly={{ y: -20, duration: 1000 }}>
               <RichText bind:value={richTextValue} />
               <button on:click={submitBio} class="button is-success is-small mt-2">
                  <span>Save bio</span>
               </button>
               <button on:click={togglePreview} class="button is-info is-small mt-2">
                  <span>Preview</span>
               </button>
               <button on:click={toggleEditing} class="button is-danger is-small mt-2">
                  <span>Cancel Editing</span>
               </button>
            </div>
         {/if}
         <!-- Is previewing bio -->
         {#if preview}
            {@html richTextValue}
            <br />
            <button on:click={togglePreview} class="button is-info is-small mt-2">
               <span>Go back to editing</span>
            </button>
         {/if}
      </div>
   {/if}
{/if}

<style>
   .bio {
      overflow-y: auto;
   }
</style>
