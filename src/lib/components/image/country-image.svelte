<script lang="ts">
   import { getName } from 'country-list';

   import { getCDNUrl } from '$lib/utils/helpers';

   export let country: string;

   $: countryImage = getCDNUrl('/flags/unknown.png');
   $: countryEmoji = 'Unknown';

   $: {
      if (country != '') {
         const toTwemojiFlag = (input: string) =>
            `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${input
               .toLowerCase()
               .match(/[a-z]/g)
               .map((i) => (i.codePointAt(0) + 127365).toString(16))
               .join('-')}.png`;
         const toEmojiFlag = (countryCode: string): string =>
            countryCode.toLowerCase().replace(/[a-z]/g, (i) => String.fromCodePoint((i.codePointAt(0) ?? 0) - 97 + 0x1f1e6));

         countryImage = toTwemojiFlag(country);
         countryEmoji = toEmojiFlag(country);
      }
   }
</script>

<img alt={countryEmoji} title={getName(country)} src={countryImage} class="country" loading="lazy" />

<style>
   .country {
      cursor: help;
      width: 18px;
      height: 18px;
      display: inline-block;
      vertical-align: middle;
      flex-shrink: 0;
   }
</style>
