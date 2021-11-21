<script lang="ts">
   import { format, register } from 'timeago.js';
   import dateFormat from 'dateformat';
   import { onMount } from 'svelte';
   export let date: Date;
   export let short: boolean = false;

   $: formattedDate = short ? format(date, 'short-locale') : format(date);
   $: hoverDate = dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');

   const shortLocale = (number: number, index: number, totalSec: number): [string, string] => {
      return [
         ['just now', 'right now'],
         ['%ss ago', 'in %s seconds'],
         ['1m ago', 'in 1 minute'],
         ['%sm ago', 'in %s minutes'],
         ['1h ago', 'in 1 hour'],
         ['%sh ago', 'in %s hours'],
         ['1d ago', 'in 1 day'],
         ['%sd ago', 'in %s days'],
         ['1w ago', 'in 1 week'],
         ['%sw ago', 'in %s weeks'],
         ['1mo ago', 'in 1 month'],
         ['%smo ago', 'in %s months'],
         ['1y ago', 'in 1 year'],
         ['%sy ago', 'in %s years']
      ][index];
   };
   // register your locale with timeago
   register('short-locale', shortLocale);

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
