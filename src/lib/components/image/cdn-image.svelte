<script lang="ts">
   import { CDN_URL } from '$lib/utils/env';
   export let src: string = '';
   export let title: string = '';
   export let className: string = '';
   $: source = CDN_URL + src;
</script>

<img src={source} class={className} {title} alt={title} />

<style>
   .image.rounded {
      border-radius: 50%;
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
   .is-country {
      cursor: help;
   }
</style>
