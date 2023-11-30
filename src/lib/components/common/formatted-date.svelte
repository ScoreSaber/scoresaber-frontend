<script lang="ts">
   import { format } from 'timeago.js';
   import dateFormat from 'dateformat';
   import { onMount } from 'svelte';

   export let date: Date;
   export let short = false;

   $: formattedDate = short ? format(date, 'short-locale') : format(date);
   $: hoverDate = dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');

   onMount(() => {
      const interval = setInterval(() => {
         formattedDate = short ? format(date, 'short-locale') : format(date);
      }, 1000);
      return () => {
         clearInterval(interval);
      };
   });
</script>

<span class="date" title={hoverDate}>{formattedDate}</span>

<style>
   .date {
      cursor: help;
   }
</style>
