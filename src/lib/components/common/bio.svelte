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
   import { fade, fly } from 'svelte/transition';

   import RichText from '$lib/components/common/rich-text.svelte';

   import permissions from '$lib/utils/permissions';
   import poster from '$lib/utils/poster';

   import type { UserData } from '$lib/models/UserData';
   import type { Player } from '$lib/models/PlayerData';

   export let userData: UserData | null;
   export let player: Player;
   export let saveStatusUpdate: SaveStatusUpdate;

   let editing = false;
   let preview = false;
   let richTextValue = player.bio || '';

   $: isOwnProfile = userData && userData.playerId === player.id;
   $: isPPFarmer =
      permissions.checkPermissionNumber(player.permissions, permissions.security.PPFARMER) ||
      permissions.checkPermissionNumber(player.permissions, permissions.groups.ALL_STAFF);
   $: canEdit = isOwnProfile && isPPFarmer;
   $: canView = (isPPFarmer || isOwnProfile) && player.bio !== null;

   async function submitBio() {
      saveStatusUpdate(SaveStatus.Started);
      editing = false;
      await poster('/api/user/update-bio', { bio: richTextValue }, { withCredentials: true });
      saveStatusUpdate(SaveStatus.Completed);
   }

   function togglePreview() {
      preview = !preview;
      editing = !editing;
   }

   function toggleEditing() {
      if (editing) {
         richTextValue = player.bio || '';
      }
      editing = !editing;
   }

   let showNotification = localStorage.getItem('hideBioNotification') !== 'true';

   function dismissNotification() {
      showNotification = false;
      localStorage.setItem('hideBioNotification', 'true');
   }
</script>

{#if canView}
   <div class="window-header">{player.name}'s bio</div>
   <div class="bio window has-shadow">
      {#if isOwnProfile && !isPPFarmer && showNotification}
         <div class="notification is-warning" transition:fade>
            <button class="delete" on:click={dismissNotification} />
            Heads up! This bio is only visible to you. To make it public, consider becoming a PPFarmer Patreon supporter.
         </div>
      {/if}

      {#if !player.bio && !editing}
         <div in:fly={{ y: 20, duration: 1000 }} class="is-center">
            <h4>{isOwnProfile ? 'Your bio is currently empty' : 'This user has not set a bio yet'}</h4>
            {#if canEdit}
               <button on:click={toggleEditing} class="button is-info is-small">
                  <span>Edit Bio</span>
               </button>
            {/if}
         </div>
      {:else if !editing && !preview}
         {@html player.bio}
         {#if canEdit}
            <br />
            <button on:click={toggleEditing} class="button is-info is-small">
               <span>Edit Bio</span>
            </button>
         {/if}
      {:else if editing}
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
      {:else if preview}
         {@html richTextValue}
         <br />
         <button on:click={togglePreview} class="button is-info is-small mt-2">
            <span>Go back to editing</span>
         </button>
      {/if}
   </div>
{/if}

<style>
   .bio {
      max-height: 320px;
      overflow-y: auto;
   }
   .notification {
      padding: 0.75rem;
      margin-bottom: 1rem;
   }
   .is-warning {
      background-color: #fffbeb;
      color: #713b17;
   }
   .delete {
      cursor: pointer;
      background-color: rgba(10, 10, 10, 0.2);
      border: none;
      border-radius: 50%;
      display: inline-block;
      height: 20px;
      width: 20px;
      position: absolute;
      right: 0.5rem;
      top: 0.5rem;
   }
   .delete::before,
   .delete::after {
      background-color: #fff;
      content: '';
      display: block;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
      transform-origin: center center;
   }
   .delete::before {
      height: 2px;
      width: 50%;
   }
   .delete::after {
      height: 50%;
      width: 2px;
   }
   .notification {
      position: relative;
   }
</style>
