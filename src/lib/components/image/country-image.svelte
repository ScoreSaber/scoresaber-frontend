<script lang="ts">
   import { getName } from 'country-list';

   export let country: string;
   const toTwemojiFlag = (input: string) =>
      `https://twemoji.maxcdn.com/v/13.1.0/svg/${input
         .toLowerCase()
         .match(/[a-z]/g)
         .map((i) => (i.codePointAt(0) + 127365).toString(16))
         .join('-')}.svg`;

   $: countryImage = toTwemojiFlag(country);
</script>

<img alt={getName(country)} title={getName(country)} src={countryImage} class="country" />

<style>
   .country {
      cursor: help;
      width: 18px;
      height: 18px;
   }
</style>
