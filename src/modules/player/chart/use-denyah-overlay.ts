import { type RefObject, useEffect } from 'react';

import type { MetricKey } from '@/modules/player/chart/chart-types';

const DENYAH_ID = '76561198064659288';
const DENYAH_SECTIONS = 10;

export function useDenyahOverlay(
   playerId: string,
   activeMetrics: Set<MetricKey>,
   rankDataValues: number[],
   overlayRef: RefObject<HTMLDivElement | null>
) {
   const isDenyah = playerId === DENYAH_ID;

   useEffect(() => {
      const overlay = overlayRef.current;
      if (!overlay || !isDenyah) return;

      if (!activeMetrics.has('rank')) {
         overlay.style.backgroundImage = '';
         overlay.style.opacity = '0';
         return;
      }

      const sectionSize = rankDataValues.length / DENYAH_SECTIONS;
      const nums: number[] = [];
      for (let i = 0; i < rankDataValues.length; i += sectionSize) {
         let sum = 0;
         for (let x = i; x < i + sectionSize; x++) {
            sum += rankDataValues[Math.floor(x)] ?? 0;
         }
         nums.push(sum / sectionSize);
      }

      let totalSum = 0;
      for (let i = 0; i < nums.length; i++) {
         totalSum += nums[i];
      }
      const trueAverage = totalSum / nums.length;

      const denyahs: string[] = [];
      const backgroundPositions: string[] = [];
      const backgroundWidth = 100 / nums.length;
      for (let i = 0; i < nums.length; i++) {
         const isGood = i === 0 ? nums[i] < trueAverage : nums[i - 1] > nums[i];
         denyahs.push(isGood ? 'url(/images/denyah-good.png)' : 'url(/images/denyah-bad.png)');
         backgroundPositions.push(`${(i / (nums.length - 1)) * 100}%`);
      }
      overlay.style.backgroundImage = denyahs.join(', ');
      overlay.style.backgroundRepeat = 'no-repeat';
      overlay.style.backgroundPositionX = backgroundPositions.join(', ');
      overlay.style.backgroundSize = `${backgroundWidth + 1}% 100%`;
      overlay.style.borderRadius = '5px';
      overlay.style.opacity = '0.1';

      return () => {
         overlay.style.backgroundImage = '';
         overlay.style.opacity = '0';
      };
   }, [isDenyah, activeMetrics, rankDataValues, overlayRef]);
}
