import { type RefObject, useEffect } from 'react';

import type { MetricKey } from '@/modules/player/chart/chart-types';
import { isDenyah } from '@/modules/player/denyah/denyah';

const DENYAH_SECTIONS = 10;

export function computeDenyahSections(rankDataValues: number[]) {
   const sectionSize = rankDataValues.length / DENYAH_SECTIONS;
   const nums: number[] = [];
   for (let i = 0; i < rankDataValues.length; i += sectionSize) {
      let sum = 0;
      for (let x = i; x < i + sectionSize; x++) {
         sum += rankDataValues[Math.floor(x)] ?? 0;
      }
      nums.push(sum / sectionSize);
   }

   const average = nums.reduce((sum, value) => sum + value, 0) / nums.length;

   return nums.map((value, i) => ({
      isGood: i === 0 ? value < average : nums[i - 1] > value,
      posPercent: (i / (nums.length - 1)) * 100
   }));
}

export function useDenyahOverlay(
   playerId: string,
   activeMetrics: Set<MetricKey>,
   rankDataValues: number[],
   overlayRef: RefObject<HTMLDivElement | null>
) {
   const denyahMode = isDenyah(playerId);

   useEffect(() => {
      const overlay = overlayRef.current;
      if (!overlay || !denyahMode) return;

      if (!activeMetrics.has('rank')) {
         overlay.style.backgroundImage = '';
         overlay.style.opacity = '0';
         return;
      }

      const sections = computeDenyahSections(rankDataValues);
      const backgroundWidth = 100 / sections.length;
      overlay.style.backgroundImage = sections
         .map((section) => (section.isGood ? 'url(/images/denyah-good.png)' : 'url(/images/denyah-bad.png)'))
         .join(', ');
      overlay.style.backgroundRepeat = 'no-repeat';
      overlay.style.backgroundPositionX = sections.map((section) => `${section.posPercent}%`).join(', ');
      overlay.style.backgroundSize = `${backgroundWidth + 1}% 100%`;
      overlay.style.borderRadius = '5px';
      overlay.style.opacity = '0.1';

      return () => {
         overlay.style.backgroundImage = '';
         overlay.style.opacity = '0';
      };
   }, [denyahMode, activeMetrics, rankDataValues, overlayRef]);
}
