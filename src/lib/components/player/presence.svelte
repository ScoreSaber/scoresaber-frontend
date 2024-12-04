<script lang="ts">
   import { slide } from 'svelte/transition';

   import { Scene, userPresence } from '$lib/stores/presence-store';
   import { searchView } from '$lib/stores/global-store';

   import { CDN_URL } from '$lib/utils/env';
   import { getDifficultyLabelSmall, getDifficultyStyle } from '$lib/utils/helpers';
   import { GameMode } from '$lib/utils/presence-socket';

   export let playerId: string | bigint;

   const status = userPresence(playerId);

   const openSearch = (val: string) => {
      $searchView?.setVisibility(true);
      $searchView?.search(val);
   };
</script>

{#if $status}
   {#key $status.scene}
      <div class="window-header" transition:slide>
         {#if $status.scene === Scene.Offline}
            <div class="dot grey" />
            <div>Offline</div>
         {/if}
         {#if $status.scene === Scene.Menu}
            <div class="dot green" />
            <div>Browsing Menus</div>
         {/if}
         {#if $status.scene === Scene.Online}
            <div class="dot green" />
            <div>Online</div>
         {/if}

         {#if $status.scene === Scene.Playing}
            <div class="dot green" />
            {#if $status.currentMap.mode !== GameMode.Practice}
               <div>Playing Beat Saber</div>
            {:else}
               <div>In Practice Mode</div>
            {/if}
         {/if}
      </div>
   {/key}
{:else}
   <div class="window-header" transition:slide>
      <img src="/images/loading.svg" alt="Loading..." class="loading" />Connecting...
   </div>
{/if}
{#if $status && $status.scene === Scene.Playing && $status.currentMap && $status.currentMap.mode !== GameMode.Practice}
   {#key $status.currentMap}
      <div class="window" transition:slide>
         <div class="ingame-info">
            <div class="song-cover">
               <div class="image" style:--image={`url(${new URL(`covers/${encodeURI($status.currentMap.hash)}.png`, CDN_URL).toString()})`} />
               <div class={getDifficultyStyle({ difficulty: $status.currentMap.difficulty })}} class:tag={true}>
                  {getDifficultyLabelSmall({ difficulty: $status.currentMap.difficulty })}
               </div>
            </div>
            <div class="metadata">
               <div class="song-title">
                  <strong>{$status.currentMap.name}</strong> by
                  <a href={'#'} on:click|preventDefault={() => openSearch($status.currentMap.artist)}>
                     <span class="mapper-name">{$status.currentMap.artist}</span>
                  </a>
               </div>
               <div>
                  Mapped by <a href={'#'} on:click|preventDefault={() => openSearch($status.currentMap.authorName)}>
                     <span class="mapper-name">{$status.currentMap.authorName}</span>
                  </a>
               </div>
            </div>
         </div>
      </div>
   {/key}
{/if}

<style>
   .loading {
      width: 1.25em;
      height: 1.25em;
   }
   .ingame-info {
      display: flex;
      flex-direction: row;
      gap: 20px;
   }
   .song-cover {
      position: relative;
   }
   .song-cover .image {
      height: 64px;
      width: 64px;
      border-radius: 0.5rem;
      background: var(--image) center / cover, url(https://cdn.scoresaber.com/avatars/steam.png) center / cover;
   }
   .song-cover .tag {
      color: #fff;
      position: absolute;
      bottom: 12px;
      right: -12px;
   }
   .metadata {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 1rem;
      line-height: 140%;
   }

   .song-title {
      font-size: 1.1rem;
   }
   .dot {
      display: inline-block;
      width: 0.5em;
      height: 0.5em;
      border-radius: 0.5em;
      align-self: center;
      background: currentColor;
      box-shadow: 0 0 5px currentColor;
   }
   .window-header {
      display: flex;
      gap: 0.5em;
      align-items: center;
   }
   .dot.grey {
      color: #777;
      box-shadow: none;
   }
   .dot.green {
      color: #90ee90;
   }
</style>
