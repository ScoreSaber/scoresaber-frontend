<script lang="ts">
   import { getName } from 'country-list';

   import { getCDNUrl } from '$lib/utils/helpers';

   export let country: string;

   $: countryImage = getCDNUrl('/flags/unknown.png');
   $: countryEmoji = 'Unknown';

   $: {
      if (country != '') {
         const toTwemojiFlag = (input: string) =>
            `https://twemoji.maxcdn.com/v/13.1.0/svg/${input
               .toLowerCase()
               .match(/[a-z]/g)
               .map((i) => (i.codePointAt(0) + 127365).toString(16))
               .join('-')}.svg`;
         const toEmojiFlag = (countryCode: string): string =>
            countryCode.toLowerCase().replace(/[a-z]/g, (i) => String.fromCodePoint((i.codePointAt(0) ?? 0) - 97 + 0x1f1e6));

         countryImage = toTwemojiFlag(country);
         countryEmoji = toEmojiFlag(country);
      }
   }
</script>

<img alt={countryEmoji} title={getName(country)} src={countryImage} class="country" />

<style>
   .country {
      cursor: help;
      width: 18px;
      height: 18px;
      display: inline-block;
      vertical-align: sub;
   }
</style>
