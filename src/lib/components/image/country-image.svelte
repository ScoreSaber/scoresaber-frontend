<script lang="ts">
   import { getCDNUrl } from '$lib/utils/helpers';
   import { getName } from 'country-list';
   export let country: string;
   $: countryImagePath = `/flags/${country.toLowerCase()}.png`;
</script>

<img alt={getName(country)} title={getName(country)} src={getCDNUrl(countryImagePath)} class="is-country" />
