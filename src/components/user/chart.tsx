import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { ChartData, ChartOptions } from 'chart.js';

class WindowProperties {
   height: number;
   width: number;
   constructor(height: number, width: number) {
      this.height = height;
      this.width = width;
   }
}

type RankChartProperties = {
   currentRank: number;
   histories: string;
};

export default function RankChart(properties: RankChartProperties) {
   const { histories, currentRank } = properties;
   const [windowProperties, setWindowProperties] = useState<WindowProperties | undefined>(undefined);

   useEffect(() => {
      window.addEventListener('resize', handleResize);
   });

   const handleResize = () => {
      setWindowProperties(new WindowProperties(window.innerHeight, window.innerWidth));
   };

   const getXTickLimit = (): number => {
      var limit = 25;
      if (windowProperties) {
         if (windowProperties.width <= 1000) {
            limit = 20;
         }
         if (windowProperties.width <= 632) {
            limit = 13;
         }
         if (windowProperties.width <= 500) {
            limit = 8;
         }
      }
      return limit;
   };

   let labels = [];
   for (let i = histories.length - 1; i > 0; i--) {
      let label = `${i} days ago`;
      if (i === 0) {
         label = 'now';
      }
      if (i === 1) {
         label = 'yesterday';
      }
      labels.push(label);
   }

   const history: number[] = histories.split(',').map(function (item) {
      return parseInt(item);
   });

   const data: ChartData = {
      labels: labels,
      datasets: [
         {
            data: history,
            label: 'Rank',
            borderColor: '#3e95cd',
            fill: false,
         },
      ],
   };

   let options: ChartOptions = {
      maintainAspectRatio: false,
      scales: {
         y: {
            ticks: {
               autoSkip: true,
               maxTicksLimit: 4,
               callback: function (label: number | string) {
                  if (Math.floor(Number(label)) === label) {
                     return label;
                  }
               },
            },
            reverse: true,
         },
         x: {
            ticks: {
               autoSkip: true,
               maxTicksLimit: getXTickLimit(),
            },
         },
      },
      plugins: {
         title: {
            display: false,
         },
         legend: {
            display: false,
         },
         tooltip: {
            mode: 'index',
            intersect: false,
         },
      },
      hover: {
         mode: 'nearest',
         intersect: true,
      },
      elements: {
         point: {
            radius: 0,
         },
      },
   };

   return <Line type="line" data={data} options={options} />;
}
