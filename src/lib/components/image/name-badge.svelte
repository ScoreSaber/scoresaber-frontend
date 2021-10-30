<script lang="ts">
   import { getCDNUrl } from '$lib/utils/helpers';
   export let badge: string;
   const nameBadgePath = `/badges/name/${badge.toLowerCase()}.png`;
</script>

<img alt={'temp'} title={'temp'} src={getCDNUrl(nameBadgePath)} class="is-name-badge" />

<style>
   img.is-name-badge {
      width: 20px;
      height: 20px;
      cursor: pointer;
   }
</style>
