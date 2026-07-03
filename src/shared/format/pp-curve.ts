export type PPCurve = readonly (readonly [scorePercent: number, multiplier: number])[];

export function calculateCurvePP(scorePercent: number, maxPP: number, curve: PPCurve) {
   if (maxPP <= 0 || scorePercent <= 0) return 0;

   const multiplier = calculateCurveMultiplier(scorePercent, curve);
   return multiplier * maxPP;
}

function calculateCurveMultiplier(scorePercent: number, curve: PPCurve) {
   const first = curve[0];
   if (!first) return 0;

   const [firstPercent, firstMultiplier] = first;
   if (scorePercent >= firstPercent) return firstMultiplier;

   let upper = first;
   for (const lower of curve.slice(1)) {
      const [upperPercent, upperMultiplier] = upper;
      const [lowerPercent, lowerMultiplier] = lower;

      if (scorePercent >= lowerPercent && scorePercent <= upperPercent) {
         if (upperPercent === lowerPercent) return upperMultiplier;

         const t = (scorePercent - lowerPercent) / (upperPercent - lowerPercent);
         return lowerMultiplier + (upperMultiplier - lowerMultiplier) * t;
      }

      upper = lower;
   }

   return 0;
}
