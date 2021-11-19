<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   import { onMount } from 'svelte';
   import Line from 'svelte-chartjs/src/Line.svelte';
   import { browser } from '$app/env';

   export let player: Player;

   const history: number[] = player.histories.split(',').map(function (item) {
      return parseInt(item);
   });

   history.push(player.rank);
   onMount(() => {
      window.addEventListener('resize', () => {
         options = getOptions();
      });
   });

   const getXTickLimit = (): number => {
      if (browser) {
         var limit = 25;
         if (window.innerWidth <= 1000) {
            limit = 20;
         }
         if (window.innerWidth <= 632) {
            limit = 13;
         }
         if (window.innerWidth <= 500) {
            limit = 8;
         }
         return limit;
      }
      return 8;
   };

   let labels = [];
   for (let i = history.length; i > 0; i--) {
      let label = `${i} days ago`;
      if (i === 1) {
         label = 'now';
      }
      if (i === 2) {
         label = 'yesterday';
      }
      labels.push(label);
   }

   const data = {
      labels: labels,
      datasets: [
         {
            lineTension: 0.4,
            data: history,
            label: 'Rank',
            borderColor: '#3e95cd',
            fill: false
         }
      ]
   };

   let options = getOptions();

   function getOptions() {
      let options = {
         maintainAspectRatio: false,
         scales: {
            y: {
               ticks: {
                  autoSkip: true,
                  maxTicksLimit: 4
               },
               reverse: true
            },
            x: {
               ticks: {
                  autoSkip: true,
                  maxTicksLimit: getXTickLimit()
               }
            }
         },
         plugins: {
            title: {
               display: false
            },
            legend: {
               display: false
            },
            tooltip: {
               mode: 'index',
               intersect: false
            }
         },
         hover: {
            mode: 'nearest',
            intersect: true
         },
         elements: {
            point: {
               radius: 0
            }
         }
      };
      return options;
   }
</script>

<div class="rank-chart">
   <Line bind:options {data} />
</div>

<style>
   .rank-chart {
      width: 100%;
      position: relative;
      min-height: 250px;
   }
</style>
