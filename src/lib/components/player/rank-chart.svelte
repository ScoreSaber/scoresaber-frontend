<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   import { onMount } from 'svelte';
   import Line from 'svelte-chartjs/src/Line.svelte';

   export let player: Player;

   const history: number[] = player.histories.split(',').map(function (item) {
      return parseInt(item);
   });

   onMount(() => {
      window.addEventListener('resize', () => {
         options = getOptions();
      });
   });

   const getXTickLimit = (): number => {
      if (typeof window !== 'undefined') {
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
   for (let i = history.length - 1; i > 0; i--) {
      let label = `${i} days ago`;
      if (i === 0) {
         label = 'now';
      }
      if (i === 1) {
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
      margin-left: -20px;
      margin-top: 5px;
      min-height: 250px;
   }
</style>
