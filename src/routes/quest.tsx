import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { Result } from 'better-result';
import { z } from 'zod';

import { QuestWizard } from '@/modules/quest/components/quest-wizard';
import { fetchQuestReleases, type QuestRelease } from '@/modules/quest/lib/releases';
import { SetPageBackground } from '@/shell/background/page-background-provider';

type QuestReleasesState = { releases: QuestRelease[]; loadError: string | null };
type QuestStep = 1 | 2 | 3 | 4;

const QUEST_STEPS: QuestStep[] = [1, 2, 3, 4];

const questStepSchema = z
   .preprocess((val) => {
      if (val == null || val === '') return 1;
      return val;
   }, z.coerce.number().int())
   .catch(1)
   .transform((step) => clampQuestStep(step));

const questSearchSchema = z.object({
   step: questStepSchema.optional()
});

function clampQuestStep(step: number): QuestStep {
   const clamped = Math.min(Math.max(step, QUEST_STEPS[0]), QUEST_STEPS[QUEST_STEPS.length - 1]);
   return QUEST_STEPS.find((questStep) => questStep === clamped) ?? QUEST_STEPS[0];
}

const getQuestPageData = createServerFn({ method: 'GET' }).handler(async () => {
   const result = await fetchQuestReleases();

   return Result.match(result, {
      ok: (value): QuestReleasesState => ({ releases: value, loadError: null }),
      err: (error): QuestReleasesState => ({ releases: [], loadError: error.message })
   });
});

export const Route = createFileRoute('/quest')({
   validateSearch: (search) => questSearchSchema.parse(search),
   loaderDeps: ({ search }) => search,
   loader: () => getQuestPageData(),
   component: QuestRoute
});

function QuestRoute() {
   const searchParams = Route.useSearch();
   const data = Route.useLoaderData();

   return (
      <div className="relative flex-1 overflow-hidden">
         <SetPageBackground src="/images/banner.jpg" />
         <div className="app-container relative z-10 p-4 md:p-8">
            <QuestWizard search={searchParams} releases={data.releases} loadError={data.loadError} />
         </div>
      </div>
   );
}
