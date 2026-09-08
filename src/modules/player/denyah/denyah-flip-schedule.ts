const schedule = {
   flipEndsAt: 0,
   nextFlipAt: Infinity
};

export function reportDenyahFlipTimings(flipEndsAt: number, nextFlipAt: number) {
   schedule.flipEndsAt = flipEndsAt;
   schedule.nextFlipAt = nextFlipAt;
}

export function resetDenyahFlipTimings() {
   schedule.flipEndsAt = 0;
   schedule.nextFlipAt = Infinity;
}

export function isDenyahFlipClearFor(durationMs: number) {
   const now = Date.now();
   return now >= schedule.flipEndsAt && now + durationMs <= schedule.nextFlipAt;
}
