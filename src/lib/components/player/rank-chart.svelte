<script lang="ts">
   import { onMount } from 'svelte';
   import { Line } from 'svelte-chartjs';

   import type { Player } from '$lib/models/PlayerData';
   import 'chart.js/auto';

   export let player: Player;

   const history: number[] = player.histories.split(',').map(function (item) {
      return parseInt(item);
   });

   history.push(player.rank);

   // If this player stopped playing for a while, but has picked up again, then remove the
   // #999999 ranks at the beginning to make the chart more useful
   const inactiveRankPlaceholder = 999999;
   const firstActiveRankIndex = history.findIndex((h) => h !== inactiveRankPlaceholder);
   if (firstActiveRankIndex >= 0) {
      history.splice(0, firstActiveRankIndex);
   }

   onMount(() => {
      if (player.id == '76561198064659288') {
         const chartCanvas = document.getElementById('rank-chart').firstElementChild as HTMLElement;

         const denyahCount = 10;
         const denyahSections = history.length / denyahCount;
         const nums: number[] = [];
         for (let i = 0; i < history.length; i += denyahSections) {
            let sum = 0;
            for (let x = i; x < i + denyahSections; x++) {
               sum += history[x];
            }
            nums.push(sum / denyahSections);
         }

         let totalSum = 0;

         for (let i = 0; i < nums.length; i++) {
            totalSum += nums[i];
         }

         let trueAverage = totalSum / nums.length;
         const denyahs: string[] = [];
         const backgroundPositions: string[] = [];
         const backgroundWidth: number = 100 / nums.length;
         for (let i = 0; i < nums.length; i++) {
            if (i == 0) {
               if (nums[i] < trueAverage) {
                  denyahs.push('url(/images/denyah-good.png)');
               } else {
                  denyahs.push('url(/images/denyah-bad.png)');
               }
            } else {
               if (nums[i - 1] > nums[i]) {
                  denyahs.push('url(/images/denyah-good.png)');
               } else {
                  denyahs.push('url(/images/denyah-bad.png)');
               }
            }
            backgroundPositions.push(`${(i / (nums.length - 1)) * 100}%`);
         }
         chartCanvas.style.backgroundImage = denyahs.join(', ');
         chartCanvas.style.backgroundRepeat = 'no-repeat';
         chartCanvas.style.backgroundPositionX = backgroundPositions.join(', ');
         chartCanvas.style.backgroundSize = `${backgroundWidth + 1}% 100%`;
         chartCanvas.style.borderRadius = '5px';
      }
   });

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
            fill: false,
            color: '#fff'
         }
      ]
   };
</script>

<div id="rank-chart" class="rank-chart">
   <Line
      {data}
      options={{
         responsive: true,
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
                  autoSkip: true
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
               intersect: false,
               mode: 'index'
            }
         },
         elements: {
            point: {
               radius: 0
            }
         }
      }}
   />
</div>

<style>
   .rank-chart {
      width: 100%;
      position: relative;
      min-height: 250px;
   }
</style>
