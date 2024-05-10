<script lang="ts">
   import { onMount } from 'svelte';
   import { Line } from 'svelte-chartjs';

   import type { Player } from '$lib/models/PlayerData';
   import 'chart.js/auto';

   export let player: Player;

   const history: number[] = player.histories.split(',').map(function (item) {
      const rank = parseInt(item);
      if (rank === 999999) {
         return null;
      }
      return rank;
   });

   history.push(player.rank);

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
   const skipped = (ctx, value) => (ctx.p0.skip || ctx.p1.skip ? value : undefined);
   const down = (ctx, value) => (ctx.p0.parsed.y < ctx.p1.parsed.y ? value : undefined);
   const data = {
      labels: labels,
      datasets: [
         {
            lineTension: 0.4,
            data: history,
            label: 'Rank',
            borderColor: '#3e95cd',
            fill: false,
            color: '#fff',
            segment: {
               borderColor: (ctx) => skipped(ctx, 'rgb(186,186,186,0.2)') || down(ctx, 'rgb(192,75,75)'),
               borderDash: (ctx) => skipped(ctx, [6, 6])
            }
         }
      ]
   };
</script>

<div id="rank-chart" class="rank-chart">
   <Line
      {data}
      options={{
         spanGaps: true,
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
