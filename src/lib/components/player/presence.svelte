<script lang="ts">
   import { slide } from 'svelte/transition';

   import { Scene, userPresence } from '$lib/stores/presence-store';

   import { searchView } from '$lib/stores/global-store';

   import { CDN_URL } from '$lib/utils/env';
   import { getDifficultyLabelSmall, getDifficultyStyle } from '$lib/utils/helpers';

   export let playerId: string | bigint;

   const status = userPresence(playerId);

   const openSearch = (val: string) => {
      $searchView?.setVisibility(true);
      $searchView?.search(val);
   };
</script>

{#key $status.scene}
   <div class="window-header" transition:slide>
      {#if $status.scene == Scene.Offline}
         <div class="dot grey" />
         <div>Offline</div>
      {/if}
      {#if $status.scene == Scene.Menu}
         <div class="dot green" />
         <div>Browsing Menus</div>
      {/if}

      {#if $status.scene == Scene.Playing}
         <div class="dot green" />
         <div>Playing Beat Saber</div>
      {/if}
   </div>
{/key}

{#if $status.scene == Scene.Playing && $status.currentMap}
   <div class="window" transition:slide>
      <div class="ingame-info">
         <div class="song-cover">
            <div class="image" style:--image={`url(${new URL(`covers/${encodeURI($status.currentMap.hash)}.png`, CDN_URL).toString()})`} />
            <div class={['tag', getDifficultyStyle({ difficulty: $status.currentMap.difficulty })].join(' ')}>
               {getDifficultyLabelSmall({ difficulty: $status.currentMap.difficulty })}
            </div>
         </div>
         <div class="metadata">
            <strong class="song-title"
               >{$status.currentMap.name} by
               <a href={'#'} on:click|preventDefault={() => openSearch($status.currentMap.artist)}>
                  <span class="mapper-name">{$status.currentMap.artist}</span>
               </a></strong
            >
            <div>
               Mapped by
               <strong
                  ><a href={'#'} on:click|preventDefault={() => openSearch($status.currentMap.authorName)}>
                     <span class="mapper-name">{$status.currentMap.authorName}</span>
                  </a></strong
               >
            </div>
         </div>
      </div>
   </div>
{/if}

<style>
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
      font-size: 1.1rem;
      line-height: 140%;
   }
   .dot {
      display: inline-block;
      width: 0.5em;
      height: 0.5em;
      border-radius: 0.5em;
      align-self: center;
      background: currentColor;
      box-shadow: 0 0px 5px currentColor;
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
   .dot.red {
      color: #f44;
   }
</style>
