import type { ScoreControllerGetScoreStatsResponse } from '@/shared/api/generated/ApiParams';

type AccuracyTimeline = ScoreControllerGetScoreStatsResponse['accuracyTimeline'];
type AccuracyDistribution = ScoreControllerGetScoreStatsResponse['accuracyDistribution'];

const MAX_CUT_SCORE = 115;

function formatChartTime(seconds: number) {
   const mins = Math.floor(seconds / 60);
   const secs = Math.floor(seconds % 60);
   return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function scorePercent(score: number) {
   return (score / MAX_CUT_SCORE) * 100;
}

function sum(values: number[]) {
   return values.reduce((total, value) => total + value, 0);
}

function countsAreRatios(values: number[]) {
   return sum(values) <= 1.5 && values.every((value) => value >= 0 && value <= 1);
}

function getBucketPercent(value: number, total: number) {
   if (total <= 0) return 0;
   return (value / total) * 100;
}

function getDisplayCount(value: number, total: number, ratioTotal: number, valuesAreRatios: boolean) {
   if (!valuesAreRatios) return value;
   if (ratioTotal <= 0) return 0;
   return (value / ratioTotal) * total;
}

function formatTooltipPercent(value: number) {
   const percent = value <= 1 ? value * 100 : value;
   return percent.toFixed(2);
}

function getScoreRange(values: number[]) {
   const finiteValues = values.filter(Number.isFinite);
   if (finiteValues.length === 0) return { min: 0, max: MAX_CUT_SCORE };

   const min = Math.max(0, Math.floor((Math.min(...finiteValues) - 0.35) * 10) / 10);
   const max = Math.min(MAX_CUT_SCORE, Math.ceil((Math.max(...finiteValues) + 0.35) * 10) / 10);
   return { min, max: Math.max(max, min + 1) };
}

function buildScoreAccuracyModel(scoreGraph: number[], endTime: number) {
   return {
      labels: scoreGraph.map((_, i) => formatChartTime((i / (scoreGraph.length - 1)) * endTime)),
      percentData: scoreGraph.map((value) => value * 100)
   };
}

function buildAccuracyTimelineModel(timeline: AccuracyTimeline) {
   const scoreValues = [
      ...timeline.total.fullSwing,
      ...timeline.total.actual,
      ...timeline.left.actual,
      ...timeline.right.actual,
      ...timeline.left.fullSwing,
      ...timeline.right.fullSwing
   ];

   return {
      labels: timeline.times.map(formatChartTime),
      scoreRange: getScoreRange(scoreValues)
   };
}

function buildAccuracyDistributionModel(distribution: AccuracyDistribution) {
   const bucketCount = Math.max(
      distribution.leftCount.length,
      distribution.rightCount.length,
      distribution.leftTd.length,
      distribution.rightTd.length,
      distribution.timingStdDev.length
   );
   const activeBuckets = Array.from({ length: bucketCount }, (_, idx) => idx).filter((idx) => {
      const hasCount = (distribution.leftCount[idx] ?? 0) > 0 || (distribution.rightCount[idx] ?? 0) > 0;
      return hasCount || distribution.leftTd[idx] != null || distribution.rightTd[idx] != null || distribution.timingStdDev[idx] != null;
   });

   if (activeBuckets.length === 0) return null;

   const start = Math.max(0, activeBuckets[0] - 1);
   const end = Math.min(bucketCount - 1, activeBuckets[activeBuckets.length - 1] + 1);
   const buckets = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
   const labels = buckets.map((bucket) => bucket.toString());

   const leftCountTotal = sum(distribution.leftCount);
   const rightCountTotal = sum(distribution.rightCount);
   const leftValuesAreRatios = countsAreRatios(distribution.leftCount);
   const rightValuesAreRatios = countsAreRatios(distribution.rightCount);
   const leftPercent = buckets.map((bucket) => getBucketPercent(distribution.leftCount[bucket] ?? 0, leftCountTotal));
   const rightPercent = buckets.map((bucket) => getBucketPercent(distribution.rightCount[bucket] ?? 0, rightCountTotal));
   const leftTd = buckets.map((bucket) => distribution.leftTd[bucket] ?? null);
   const rightTd = buckets.map((bucket) => distribution.rightTd[bucket] ?? null);
   const timingStdDev = buckets.map((bucket) => distribution.timingStdDev[bucket] ?? null);
   const timingPlot = timingStdDev.map((value) => (value == null ? null : value * 40));
   const maxPercent = Math.max(10, ...leftPercent, ...rightPercent);
   const maxTd = Math.max(
      0.1,
      ...leftTd.filter((value) => value != null),
      ...rightTd.filter((value) => value != null),
      ...timingPlot.filter((value) => value != null)
   );

   return {
      buckets,
      labels,
      leftCountTotal,
      rightCountTotal,
      leftValuesAreRatios,
      rightValuesAreRatios,
      leftPercent,
      rightPercent,
      leftTd,
      rightTd,
      timingPlot,
      maxPercent,
      maxTd
   };
}

export { buildAccuracyDistributionModel, buildAccuracyTimelineModel, buildScoreAccuracyModel, formatTooltipPercent, getDisplayCount, scorePercent };
