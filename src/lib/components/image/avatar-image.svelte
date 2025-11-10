<script lang="ts">
   import { getCDNUrl } from '$lib/utils/helpers';

   export let userId: string;
   $: imagePath = `/avatars/${userId}.jpg`;
</script>

<img alt={userId + ' Avatar'} src={getCDNUrl(imagePath)} class="is-avatar" loading="lazy" />

<style>
   .is-avatar {
      border-radius: 5px;
   }
</style>
