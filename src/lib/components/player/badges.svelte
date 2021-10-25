<script type="ts">
   import type { Player } from '$lib/models/PlayerData';
   import { getCDNUrl } from '$lib/utils/helpers';
   export let player: Player;
   let badgeClass = 'image is-badge';
   if (player.badges.length > 1) {
      badgeClass += ' grouped';
   }
</script>

<div class="badges">
   {#each player.badges as badge, i}
      <img src={getCDNUrl('/badges/' + badge.image)} title={badge.description} alt={badge.description} class={badgeClass} />
   {/each}
</div>

<style>
   .badges {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
   }
   .image.is-badge {
      border-radius: 7%;
      margin-bottom: 5px;
      width: 80px;
      height: 30px;
      cursor: help;
   }
   .image.is-badge.grouped {
      margin-right: 8px;
   }
</style>
