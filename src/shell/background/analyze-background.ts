import { Result } from 'better-result';

// region boost: amplify positively scoring pixels concentrated in the top-center
// curve: exponential peak across the middle 25% (+/-CORE_HALF from center), then a
// gentle linear tail out to the image edges. only applied to pixels that hit a
// positive hue rule (blue/purple, teal/cyan) -- negatives stay unchanged
const REGION_CORE_HALF = 0.125; // half width of the boosted core (25% total)
const REGION_PEAK = 3; // boost at dead center
const REGION_SHOULDER = 1.2; // boost at core edge (dist = CORE_HALF)
const REGION_EDGE = 1; // boost at image edge (dist = 0.5)
const REGION_FALLOFF = 4; // exponential decay rate inside core

function regionBoost(xNorm: number) {
   const dist = Math.abs(xNorm - 0.5); // 0 at center, 0.5 at edges
   if (dist <= REGION_CORE_HALF) {
      const t = dist / REGION_CORE_HALF;
      // exponential drop from PEAK toward SHOULDER
      const eCurve = (Math.exp(-REGION_FALLOFF * t) - Math.exp(-REGION_FALLOFF)) / (1 - Math.exp(-REGION_FALLOFF));
      return REGION_SHOULDER + (REGION_PEAK - REGION_SHOULDER) * eCurve;
   }
   // linear tail from SHOULDER down to EDGE
   const t = (dist - REGION_CORE_HALF) / (0.5 - REGION_CORE_HALF);
   return REGION_SHOULDER + (REGION_EDGE - REGION_SHOULDER) * t;
}

// structured pixel diagnostics surfaced in the dev panel
export interface Diagnostics {
   avgSaturation: number;
   avgLightness: number;
   hueBuckets: {
      bluePurple: number; // 200-320, x1.6
      tealCyan: number; // 160-200, x1.5
      redWarm: number; // <30 or >330, x0.7
      orangeYellow: number; // 30-70, x0.5
      other: number; // greens 70-160, x1.0
   };
   lightnessBuckets: {
      veryBright: number; // >0.6, x(0.05+s*0.25)
      bright: number; // 0.45-0.6, x(0.2+s*0.5)
      mid: number; // 0.15-0.45, x1.0
      dark: number; // 0.08-0.15, x0.75
      veryDark: number; // <0.08, x0.4
   };
   region: {
      positiveCoreShare: number; // fraction of positive-hue pixels inside middle 25%
      avgBoostOnPositive: number; // mean region boost applied to positive-hue pixels (1.0 = no boost)
      brightInCoreShare: number; // fraction of total pixels that were bright+in-core (got center-bright penalty)
   };
   // post-score multipliers applied after summing per-pixel scores
   post: {
      rawScore: number; // mean per-pixel score before any post multipliers
      satGate: number; // min(1, avgSat/0.5)^0.8 - low-sat images create washed-out halos
      hueConcentrationPenalty: number; // <1 when a single hue bucket exceeds 95%
   };
}

function emptyDiagnostics(): Diagnostics {
   return {
      avgSaturation: 0,
      avgLightness: 0,
      hueBuckets: { bluePurple: 0, tealCyan: 0, redWarm: 0, orangeYellow: 0, other: 0 },
      lightnessBuckets: { veryBright: 0, bright: 0, mid: 0, dark: 0, veryDark: 0 },
      region: { positiveCoreShare: 0, avgBoostOnPositive: 1, brightInCoreShare: 0 },
      post: { rawScore: 0, satGate: 1, hueConcentrationPenalty: 1 }
   };
}

// linear ramp from 1.0 at l<=0.45 to 0.55 at l>=0.8
function lightnessToIntensity(l: number) {
   if (l <= 0.45) return 1;
   if (l >= 0.8) return 0.55;
   return 1 - ((l - 0.45) / 0.35) * 0.45;
}

// score vibrancy of an image's top region and derive an opacity multiplier.
// prefers saturated blues & purples, penalises grays/whites/blacks.
export function analyzeImage(url: string) {
   return new Promise<{ score: number; intensity: number; diagnostics: Diagnostics }>((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
         const canvas = document.createElement('canvas');
         const size = 32;
         canvas.width = size;
         canvas.height = size;
         const ctx = canvas.getContext('2d');
         if (!ctx) {
            resolve({ score: -1, intensity: 1, diagnostics: emptyDiagnostics() });
            return;
         }
         ctx.drawImage(img, 0, 0, size, size);
         // sample top ~40%, that's what shows behind the header
         const rows = Math.ceil(size * 0.4);
         const data = Result.unwrapOr(
            Result.try(() => ctx.getImageData(0, 0, size, rows).data),
            null
         );
         if (!data) {
            resolve({ score: -1, intensity: 1, diagnostics: emptyDiagnostics() }); // cors blocked
            return;
         }

         const count = size * rows;
         let totalScore = 0;
         let totalLightness = 0;
         let totalSaturation = 0;
         let positivePixels = 0;
         let positiveInCore = 0;
         let totalBoostOnPositive = 0;
         let brightInCore = 0;
         const hueBuckets = { bluePurple: 0, tealCyan: 0, redWarm: 0, orangeYellow: 0, other: 0 };
         const lightnessBuckets = { veryBright: 0, bright: 0, mid: 0, dark: 0, veryDark: 0 };

         for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const l = (max + min) / 2;
            const d = max - min;
            const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

            totalLightness += l;
            totalSaturation += s;

            let hue = 0;
            if (d !== 0) {
               if (max === r) hue = ((g - b) / d + 6) % 6;
               else if (max === g) hue = (b - r) / d + 2;
               else hue = (r - g) / d + 4;
               hue *= 60;
            }

            // saturation is the primary vibrancy signal
            let px = s;
            let isPositiveHue = false;

            // cool tones look great blurred on dark bg, warm tones wash out
            if (hue >= 200 && hue <= 320) {
               px *= 1.6; // blues & purples
               hueBuckets.bluePurple++;
               isPositiveHue = true;
            } else if (hue >= 160 && hue < 200) {
               px *= 1.5; // teals & cyans - bumped closer to blue, user prefers teal-heavy images
               hueBuckets.tealCyan++;
               isPositiveHue = true;
            } else if (hue < 30 || hue > 330) {
               px *= 0.7; // reds - softened from 0.3, still penalised vs cool tones but doesn't crush diverse palettes
               hueBuckets.redWarm++;
            } else if (hue >= 30 && hue < 70) {
               px *= 0.5; // oranges & yellows - softened from 0.2 for same reason
               hueBuckets.orangeYellow++;
            } else {
               hueBuckets.other++;
            }

            // bright blooms when blurred at low opacity; dark blurs cleanly and
            // doesn't wash out ui - softened the dark penalties since they were
            // tanking otherwise-good moody blue avatars.
            // bright penalties are sat-aware: a vivid bright pixel (high sat teal
            // at l=0.5) looks great blurred, but a desaturated bright pixel (low
            // sat at l=0.5) creates a washed-out halo.
            if (l > 0.6) {
               px *= 0.05 + s * 0.25; // 0.05 at s=0, 0.3 at s=1
               lightnessBuckets.veryBright++;
            } else if (l > 0.45) {
               px *= 0.2 + s * 0.5; // 0.2 at s=0, 0.7 at s=1
               lightnessBuckets.bright++;
            } else if (l < 0.08) {
               px *= 0.4; // was 0.1 - very dark isn't a halo risk
               lightnessBuckets.veryDark++;
            } else if (l < 0.15) {
               px *= 0.75; // was 0.4 - dark blues blur beautifully, don't punish
               lightnessBuckets.dark++;
            } else {
               lightnessBuckets.mid++;
            }

            const pixelIndex = i / 4;
            const x = pixelIndex % size;
            const xNorm = (x + 0.5) / size;
            const distFromCenter = Math.abs(xNorm - 0.5);

            // center-bright penalty: bright pixels near the horizontal center sit
            // right behind the header and bloom into a visible white halo. applied
            // regardless of hue - the halo color comes from the brightness, not the
            // hue. peaks at dead center (x0.15), fades to x1 at the core edge.
            if (l > 0.45 && distFromCenter <= REGION_CORE_HALF) {
               const centerness = 1 - distFromCenter / REGION_CORE_HALF;
               px *= 1 - centerness * 0.85;
               brightInCore++;
            }

            // region boost: reward positive-hue pixels for being near the top-center
            if (isPositiveHue) {
               const boost = regionBoost(xNorm);
               px *= boost;
               positivePixels++;
               totalBoostOnPositive += boost;
               if (distFromCenter <= REGION_CORE_HALF) positiveInCore++;
            }

            totalScore += px;
         }

         const rawScore = totalScore / count;
         const avgLightness = totalLightness / count;
         const avgSaturation = totalSaturation / count;

         // saturation gate: extends smoothly from 0% to 50% sat. images in the
         // 30-50% range looked washed out / "white" even though they passed the
         // old 30% threshold. gentler power curve (^0.8) avoids crushing subtle
         // gradients at very low sat quite as hard as the old ^1.5 cliff.
         const satGate = avgSaturation >= 0.5 ? 1 : (avgSaturation / 0.5) ** 0.8;

         // hue concentration penalty: 100% single-hue distributions look too
         // digital/artificial when blurred. only kicks in above 95%.
         const hueShares = [
            hueBuckets.bluePurple / count,
            hueBuckets.tealCyan / count,
            hueBuckets.redWarm / count,
            hueBuckets.orangeYellow / count,
            hueBuckets.other / count
         ];
         const maxHueShare = Math.max(...hueShares);
         const hueConcentrationPenalty = maxHueShare > 0.95 ? Math.max(0.6, 1 - (maxHueShare - 0.95) * 4) : 1;

         const finalScore = rawScore * satGate * hueConcentrationPenalty;

         resolve({
            score: finalScore,
            intensity: lightnessToIntensity(avgLightness),
            diagnostics: {
               avgSaturation,
               avgLightness,
               hueBuckets: {
                  bluePurple: hueBuckets.bluePurple / count,
                  tealCyan: hueBuckets.tealCyan / count,
                  redWarm: hueBuckets.redWarm / count,
                  orangeYellow: hueBuckets.orangeYellow / count,
                  other: hueBuckets.other / count
               },
               lightnessBuckets: {
                  veryBright: lightnessBuckets.veryBright / count,
                  bright: lightnessBuckets.bright / count,
                  mid: lightnessBuckets.mid / count,
                  dark: lightnessBuckets.dark / count,
                  veryDark: lightnessBuckets.veryDark / count
               },
               region: {
                  positiveCoreShare: positivePixels === 0 ? 0 : positiveInCore / positivePixels,
                  avgBoostOnPositive: positivePixels === 0 ? 1 : totalBoostOnPositive / positivePixels,
                  brightInCoreShare: brightInCore / count
               },
               post: {
                  rawScore,
                  satGate,
                  hueConcentrationPenalty
               }
            }
         });
      };
      img.onerror = () => resolve({ score: -1, intensity: 1, diagnostics: emptyDiagnostics() });
      img.src = getAnalysisImageUrl(url);
   });
}

export type ScoredImage = { url: string; score: number; intensity: number; diagnostics: Diagnostics };

function getAnalysisImageUrl(url: string) {
   if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
   }

   const parsed = Result.unwrapOr(
      Result.try(() => new URL(url, window.location.href)),
      null
   );

   if (!parsed) {
      return url;
   }

   parsed.searchParams.set('cors-analysis', '1');
   return parsed.toString();
}
