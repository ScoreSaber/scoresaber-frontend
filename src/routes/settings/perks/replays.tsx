import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { PerksSubNav } from '@/modules/settings/perks-sub-nav';
import { ReplaySlotsSection } from '@/modules/settings/sections/replay-slots-section';
import { SettingsShell } from '@/modules/settings/settings-shell';
import type { ScoreControllerGetScoreResponse } from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { optionalApiData } from '@/shared/result/api';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getPerksReplaysData = createServerFn({ method: 'GET' }).handler(async () => {
   const replaySlots = await optionalApiData(api.user.userControllerGetReplaySlots());
   let scoreDetails: Record<number, ScoreControllerGetScoreResponse | null> = {};

   if (replaySlots) {
      const scoreIds = new Set([...replaySlots.slots, ...replaySlots.claimable].map((slot) => slot.scoreId));
      const entries = await Promise.all([...scoreIds].map(loadScoreDetailEntry));
      scoreDetails = Object.fromEntries(entries);
   }

   return { replaySlots, scoreDetails };
});

export const Route = createFileRoute('/settings/perks/replays')({
   loader: () => getPerksReplaysData(),
   head: () => ({
      meta: [{ title: 'Replays | ScoreSaber!' }]
   }),
   component: SettingsPerksReplaysRoute
});

function SettingsPerksReplaysRoute() {
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="perks">
            <PerksSubNav activeSubTab="replays">
               <ReplaySlotsSection replaySlots={data.replaySlots} scoreDetails={data.scoreDetails} />
            </PerksSubNav>
         </SettingsShell>
      </>
   );
}

async function loadScoreDetailEntry(id: number) {
   const score = await optionalApiData(api.score.scoreControllerGetScore({ id, includeScoreStats: 'false' }));
   return [id, score] as const;
}
