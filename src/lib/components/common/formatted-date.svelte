<script lang="ts">
   import { format } from 'timeago.js';
   import dateFormat from 'dateformat';
   import { onMount } from 'svelte';
   export let date: Date;

   $: formattedDate = format(date);
   $: hoverDate = dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');

   onMount(() => {
      const interval = setInterval(() => {
         formattedDate = format(date);
         hoverDate = dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
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
