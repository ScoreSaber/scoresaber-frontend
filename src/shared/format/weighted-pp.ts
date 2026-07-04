const PP_WEIGHT_DECAY = 0.965;

export interface WeightedPPScore {
   pp: number;
   weight: number;
}

interface RawPPForTotalPPGainOptions {
   scores: WeightedPPScore[];
   totalPP: number;
   totalRankedScores: number;
   gain?: number;
}

export function calculateRawPPForTotalPPGain({ scores, totalPP, totalRankedScores, gain = 1 }: RawPPForTotalPPGainOptions) {
   if (totalPP <= 0 || gain <= 0) return null;

   const rankedScores = scores.filter((score) => score.pp > 0).sort((a, b) => b.pp - a.pp);
   if (rankedScores.length === 0) return null;

   let prefixWeightedPP = 0;

   for (const [index, score] of rankedScores.entries()) {
      const weight = getWeightAtIndex(rankedScores, index);
      const requiredPP = calculateRequiredRawPP(totalPP, prefixWeightedPP, weight, gain);
      const previousPP = rankedScores[index - 1]?.pp ?? Number.POSITIVE_INFINITY;

      if (requiredPP <= previousPP && requiredPP >= score.pp) {
         return requiredPP;
      }

      prefixWeightedPP += score.pp * weight;
   }

   if (rankedScores.length < totalRankedScores) return null;

   const finalWeight = getWeightAtIndex(rankedScores, rankedScores.length);
   const requiredPP = calculateRequiredRawPP(totalPP, prefixWeightedPP, finalWeight, gain);
   const previousPP = rankedScores.at(-1)?.pp ?? Number.POSITIVE_INFINITY;

   return requiredPP <= previousPP ? requiredPP : null;
}

function calculateRequiredRawPP(totalPP: number, prefixWeightedPP: number, weight: number, gain: number) {
   const tailWeightedPP = Math.max(0, totalPP - prefixWeightedPP);
   return (gain + (1 - PP_WEIGHT_DECAY) * tailWeightedPP) / weight;
}

function getWeightAtIndex(scores: WeightedPPScore[], index: number) {
   const scoreWeight = scores[index]?.weight;
   if (scoreWeight && scoreWeight > 0) return scoreWeight;

   const previousWeight = scores[index - 1]?.weight;
   if (previousWeight && previousWeight > 0) return previousWeight * PP_WEIGHT_DECAY;

   return PP_WEIGHT_DECAY ** index;
}
