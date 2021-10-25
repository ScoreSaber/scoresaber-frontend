<script type="ts">
   import type { Player } from '$lib/models/PlayerData';
   import CDNImage from '$lib/components/image/cdn-image.svelte';
   export let player: Player;
   let badgeClass = 'image is-badge';
   if (player.badges.length > 1) {
      badgeClass += ' grouped';
   }
</script>

<div class="badges">
   {#each player.badges as badge, i}
      <CDNImage src={'/badges/' + badge.image} title={badge.description} className={badgeClass} />
   {/each}
</div>

<style>
   .badges {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
   }
</style>
