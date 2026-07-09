'use client';

import { useMemo, useState } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { StepDownload } from './step-download';
import { StepInstall } from './step-install';
import { StepSignIn } from './step-sign-in';
import { StepWelcome } from './step-welcome';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/modules/auth';
import type { QuestRelease } from '@/modules/quest/lib/releases';
import { Icons } from '@/shared/components/icons';
import { cn } from '@/shared/format/helpers';

const questRoute = getRouteApi('/quest');

type QuestStep = 1 | 2 | 3 | 4;
type QuestSearchParams = {
   step?: QuestStep;
};

const QUEST_STEPS: QuestStep[] = [1, 2, 3, 4];
const TOTAL_STEPS = QUEST_STEPS.length;

function clampQuestStep(step: number): QuestStep {
   const clamped = Math.min(Math.max(step, QUEST_STEPS[0]), QUEST_STEPS[QUEST_STEPS.length - 1]);
   return QUEST_STEPS.find((questStep) => questStep === clamped) ?? QUEST_STEPS[0];
}

export function QuestWizard({ search, releases, loadError }: { search: QuestSearchParams; releases: QuestRelease[]; loadError: string | null }) {
   const t = useTranslations();
   const { user } = useAuth();
   const [showPrereleases, setShowPrereleases] = useState(false);

   const step = clampQuestStep(search.step ?? 1);
   const previousStep = clampQuestStep(step - 1);
   const nextStep = clampQuestStep(step + 1);

   const hasPrereleases = useMemo(() => releases.some((r) => r.prerelease), [releases]);
   const visibleReleases = useMemo(() => (showPrereleases ? releases : releases.filter((r) => !r.prerelease)), [releases, showPrereleases]);

   const canAdvance = step === 2 ? Boolean(user) : true;
   const prevDisabled = step === 1;
   const isFinalStep = step === TOTAL_STEPS;
   const nextDisabled = !canAdvance;

   return (
      <div className="flex flex-col gap-6">
         <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
               <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {step === 1
                     ? t('quest.step.1.title')
                     : step === 2
                       ? t('quest.step.2.title')
                       : step === 3
                         ? t('quest.step.3.title')
                         : t('quest.step.4.title')}
               </h1>
               <span className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                  {t('quest.progress', { current: step, total: TOTAL_STEPS })}
               </span>
            </div>
            <Stepper currentStep={step} />
         </div>

         <Separator variant="gradient" />

         <div>
            {loadError && step === 3 ? (
               <Alert variant="destructive" className="mb-4">
                  <AlertTitle>{t('quest.error.releasesUnavailableTitle')}</AlertTitle>
                  <AlertDescription>{t('quest.error.releasesUnavailableDescription')}</AlertDescription>
               </Alert>
            ) : null}

            {step === 1 ? <StepWelcome /> : null}
            {step === 2 ? <StepSignIn /> : null}
            {step === 3 ? (
               <StepDownload
                  releases={visibleReleases}
                  hasPrereleases={hasPrereleases}
                  showPrereleases={showPrereleases}
                  onTogglePrereleases={setShowPrereleases}
               />
            ) : null}
            {step === 4 ? <StepInstall /> : null}
         </div>

         <Separator variant="gradient" />

         <div className="flex items-center justify-between">
            {prevDisabled ? (
               <Button variant="secondary" disabled>
                  <ArrowLeft className="size-4" />
                  {t('quest.action.previous')}
               </Button>
            ) : (
               <questRoute.Link search={{ step: previousStep > 1 ? previousStep : undefined }} resetScroll={false}>
                  <Button variant="secondary">
                     <ArrowLeft className="size-4" />
                     {t('quest.action.previous')}
                  </Button>
               </questRoute.Link>
            )}
            {isFinalStep ? null : nextDisabled ? (
               <Button disabled>
                  {t('quest.action.next')}
                  <ArrowRight className="size-4" />
               </Button>
            ) : (
               <questRoute.Link search={{ step: nextStep > 1 ? nextStep : undefined }} resetScroll={false}>
                  <Button>
                     {t('quest.action.next')}
                     <ArrowRight className="size-4" />
                  </Button>
               </questRoute.Link>
            )}
         </div>

         <WizardFooter />
      </div>
   );
}

function Stepper({ currentStep }: { currentStep: QuestStep }) {
   const t = useTranslations();
   return (
      <ol className="flex items-center gap-2">
         {QUEST_STEPS.map((stepIndex, i) => {
            const isComplete = stepIndex < currentStep;
            const isCurrent = stepIndex === currentStep;
            return (
               <li key={stepIndex} className="flex flex-1 items-center gap-2 last:flex-none">
                  <div
                     aria-current={isCurrent ? 'step' : undefined}
                     className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                        isComplete && 'border-primary bg-primary text-primary-foreground',
                        isCurrent && 'border-primary text-primary',
                        !isComplete && !isCurrent && 'border-border text-muted-foreground'
                     )}
                  >
                     {isComplete ? <CheckCircle2 className="size-4" /> : stepIndex}
                     <span className="sr-only">
                        {stepIndex === 1
                           ? t('quest.step.1.title')
                           : stepIndex === 2
                             ? t('quest.step.2.title')
                             : stepIndex === 3
                               ? t('quest.step.3.title')
                               : t('quest.step.4.title')}
                     </span>
                  </div>
                  {i < QUEST_STEPS.length - 1 ? (
                     <div className={cn('bg-border h-px flex-1 transition-colors', stepIndex < currentStep && 'bg-primary')} />
                  ) : null}
               </li>
            );
         })}
      </ol>
   );
}

function WizardFooter() {
   const t = useTranslations();
   return (
      <div className="text-muted-foreground flex flex-col items-center gap-2 pt-4 text-center text-xs">
         <p>{t('quest.footer.patreonPerks')}</p>
         <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
               href="https://patreon.com/scoresaber/membership"
               target="_blank"
               rel="external noreferrer"
               className="text-foreground hover:text-primary inline-flex items-center gap-2 font-medium transition-colors"
            >
               <Icons.patreon className="size-3.5 fill-current" aria-hidden />
               {t('quest.footer.patreon')}
            </a>
            <a
               href="https://github.com/ScoreSaber/quest-mod"
               target="_blank"
               rel="external noreferrer"
               className="text-foreground hover:text-primary inline-flex items-center gap-2 font-medium transition-colors"
            >
               <Icons.github className="size-3.5 fill-current" aria-hidden />
               {t('quest.footer.sourceCode')}
            </a>
         </div>
      </div>
   );
}
