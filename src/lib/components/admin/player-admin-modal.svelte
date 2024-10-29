<script type="ts">
   import { getContext } from 'svelte';

   import PlayerLink from '$lib/components/player/player-link.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';

   import { getPermissionList } from '$lib/utils/helpers';

   import type { Player, Role } from '$lib/models/PlayerData';

   export let onBanClick: (player: Player, reason: string) => void;
   export let onUnbanClick: (player: Player) => void;
   export let onGiveRoleClick: (player: Player, role: string) => void;
   export let onRemoveRoleClick: (player: Player, role: string) => void;
   export let onOverrideRoleTextClick: (player: Player, role: string) => void;
   export let onResetCountryClick: (player: Player) => void;
   export let player: Player;

   const { close } = getContext('simple-modal');

   let currentRoles: Role[] = getPermissionList(player.permissions);

   $: roleText = player.role;
   $: banReason = '';
   $: givenRole = 'rtr';
   $: roleToRemove = '';
</script>

<div class="media">
   <div class="media-content is-clipped">
      <div class="player-info mb-2">
         <span class="text-muted">Administrating</span>
         <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-24x24" />
         <b>
            <PlayerLink {player} destination={`/u/${player.id}`} />
         </b>
      </div>
      <div class="tools">
         <div class="tools-row">
            {#if player.banned}
               <div class="window tool mt-3">
                  <div class="title is-6 mb-3">Unban User</div>
                  <div class="tool-body-container">
                     <button
                        on:click={() => {
                           onUnbanClick(player);
                           close();
                        }}
                        class="button is-success is-small mt-1"
                     >
                        <span>Unban</span>
                     </button>
                  </div>
               </div>
            {:else}
               <div class="window tool mt-3">
                  <div class="title is-6 mb-3">Ban User</div>
                  <div class="tool-body-container">
                     <TextInput bind:value={banReason} isSmall={true} placeholder="Ban Reason" />
                     <button
                        on:click={() => {
                           onBanClick(player, banReason);
                           close();
                        }}
                        class="button is-danger is-small mt-1"
                     >
                        <span>Ban</span>
                     </button>
                  </div>
               </div>
            {/if}
            <div class="window tool mt-3">
               <div class="title is-6 mb-3">Reset Players Country</div>
               <div class="tool-body-container">
                  <button
                     on:click={() => {
                        onResetCountryClick(player);
                        close();
                     }}
                     class="button is-danger is-small mt-1"
                  >
                     <span>Reset Country</span>
                  </button>
               </div>
            </div>
         </div>
         <div class="tools-row">
            <div class="window tool mt-3">
               <div class="title is-6 mb-3">Give Role</div>
               <div class="tool-body-container">
                  <div class="select is-small">
                     <select bind:value={givenRole} id="roles">
                        <option value="rtr">RT Recruit</option>
                        <option value="rt">RT</option>
                        <option value="qat">QAT</option>
                        <option value="cat">CAT</option>
                        <option value="nat">NAT</option>
                        <option value="qathead">QAT Head</option>
                        <option value="dev">Developer</option>
                        <option value="ppv3">PPv3 Developer</option>
                        <option value="cct">Content Creation Team</option>
                     </select>
                  </div>
                  <button
                     on:click={() => {
                        onGiveRoleClick(player, givenRole);
                        close();
                     }}
                     class="button is-small is-success mt-1"
                  >
                     <span>Give Role</span>
                  </button>
               </div>
            </div>
            <div class="window tool mt-3">
               <div class="title is-6 mb-3">Remove Role</div>
               <div class="tool-body-container">
                  <div class="select is-small">
                     <select bind:value={roleToRemove} id="roles">
                        {#each currentRoles as role}
                           <option value={role}>{role}</option>
                        {/each}
                     </select>
                  </div>
                  <button
                     on:click={() => {
                        onRemoveRoleClick(player, roleToRemove);
                        close();
                     }}
                     class="button is-small is-danger mt-1"
                  >
                     <span>Remove Role</span>
                  </button>
               </div>
            </div>
            <div class="window tool mt-3">
               <div class="title is-6 mb-3">Override Role Text</div>
               <div class="tool-body-container">
                  <TextInput bind:value={roleText} isSmall={true} />
                  <button
                     on:click={() => {
                        onOverrideRoleTextClick(player, roleText);
                        close();
                     }}
                     class="button is-danger is-small mt-1"
                  >
                     <span>Change Role Text</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>

<style>
   .window {
      background-color: var(--gray) !important;
   }
   .window.tool {
      margin-left: 5px;
      margin-right: 5px;
      flex-grow: 1;
   }
   .media-content {
      color: white;
   }

   .tools {
      display: flex;
      flex-direction: column;
   }

   .tools-row {
      display: flex;
      flex-direction: row;
   }

   .tool-body-container {
      display: flex;
      flex-direction: column;
   }

   .media {
      padding: 1rem;
      position: relative;
      z-index: 1;
   }
   .player-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
   }
   .text-muted {
      color: var(--muted);
   }

   @media only screen and (max-width: 769px) {
      .tools-row {
         flex-direction: column;
      }
   }
</style>
