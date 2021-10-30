<script lang="ts">
   import { format } from 'timeago.js';
   import dateFormat from 'dateformat';
   export let date: Date;
</script>

<span class="date" title={dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}>{format(date)}</span>

<style>
   .date {
      cursor: help;
   }
</style>
