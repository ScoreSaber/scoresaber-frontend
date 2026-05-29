const STAR_MULTIPLIER = 10.685333512;
const PP_BASE = 450;

export function starsToPP(stars: number) {
   return parseFloat(((stars * PP_BASE) / STAR_MULTIPLIER).toFixed(2));
}
