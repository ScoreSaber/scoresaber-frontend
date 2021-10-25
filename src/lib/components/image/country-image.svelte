<script lang="ts">
   import CDNImage from '$lib/components/image/cdn-image.svelte';
   import { getName } from 'country-list';
   export let country: string;
   const countryImagePath = `/flags/${country.toLowerCase()}.png`;
</script>

<CDNImage title={getName(country)} src={countryImagePath} className="is-country" />
