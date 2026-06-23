'use client';

import { useEffect, useMemo, useState } from 'react';

import { Loader2, Save, Settings } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { DirtyNavigationBlocker } from '@/hooks/use-dirty-navigation-blocker';
import { upsertLiveSettings } from '@/modules/live/actions/admin';
import { FormField, LiveSection } from '@/modules/live/components/live-ui';
import type { LiveTournamentControllerUpsertSettingsPayload } from '@/shared/api/generated/Api';
import type {
   LiveTournamentControllerGetSettingsResponse,
   LiveTournamentControllerGetWorkflowOptionsResponse
} from '@/shared/api/generated/ApiParams';

type LiveTournamentStatus = NonNullable<LiveTournamentControllerUpsertSettingsPayload['status']>;

export function LiveSettingsPanel({
   tournamentId,
   settings,
   options
}: {
   tournamentId: string;
   settings: LiveTournamentControllerGetSettingsResponse | null;
   options: LiveTournamentControllerGetWorkflowOptionsResponse;
}) {
   const t = useTranslations('live');
   const mutation = useActionMutation<LiveTournamentControllerGetSettingsResponse>();
   const statusSchema = useMemo(() => createStatusSchema(options.tournamentStatuses), [options.tournamentStatuses]);
   const defaultStatus = options.tournamentStatuses[0]!;
   const [savedName, setSavedName] = useState(settings?.name ?? tournamentId);
   const [savedStatus, setSavedStatus] = useState<LiveTournamentControllerUpsertSettingsPayload['status']>(settings?.status ?? defaultStatus);
   const [name, setName] = useState(savedName);
   const [status, setStatus] = useState<LiveTournamentControllerUpsertSettingsPayload['status']>(savedStatus);
   const pending = mutation.isPending;
   const isDirty = name !== savedName || status !== savedStatus;

   useEffect(() => {
      const nextName = settings?.name ?? tournamentId;
      const nextStatus = settings?.status ?? defaultStatus;
      setSavedName(nextName);
      setSavedStatus(nextStatus);
      setName(nextName);
      setStatus(nextStatus);
   }, [defaultStatus, settings, tournamentId]);

   function saveSettings() {
      const payload: LiveTournamentControllerUpsertSettingsPayload = {
         name: name.trim() || tournamentId,
         status
      };

      mutation.run(
         () => upsertLiveSettings(tournamentId, payload),
         t('settingsSaved'),
         t('settingsSaveFailed'),
         (result) => {
            const nextName = result.name ?? tournamentId;
            setSavedName(nextName);
            setSavedStatus(result.status);
            setName(nextName);
            setStatus(result.status);
         }
      );
   }

   return (
      <>
         <LiveSection
            title={t('tournamentSettings')}
            icon={<Settings data-icon />}
            actions={
               <Button className="cursor-pointer" onClick={saveSettings} disabled={pending || !isDirty}>
                  {pending ? <Loader2 className="animate-spin" /> : <Save data-icon="inline-start" />}
                  {t('saveChanges')}
               </Button>
            }
         >
            <div className="grid gap-3 md:grid-cols-2">
               <FormField id="live-name" label={t('name')}>
                  <Input id="live-name" value={name} onChange={(event) => setName(event.target.value)} disabled={pending} />
               </FormField>
               <FormField id="live-status" label={t('status')}>
                  <Select
                     value={status}
                     onValueChange={(value) => {
                        const result = statusSchema.safeParse(value);
                        if (result.success) setStatus(result.data);
                     }}
                     disabled={pending}
                  >
                     <SelectTrigger id="live-status" className="cursor-pointer">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectGroup>
                           {options.tournamentStatuses.map((item) => (
                              <SelectItem key={item} value={item}>
                                 {item}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </FormField>
            </div>
         </LiveSection>
         <DirtyNavigationBlocker
            isDirty={isDirty}
            title={t('unsavedChangesTitle')}
            description={t('unsavedChangesConfirm')}
            confirmLabel={t('leaveWithoutSaving')}
         />
      </>
   );
}

function createStatusSchema(statuses: readonly LiveTournamentStatus[]) {
   return z.custom<LiveTournamentStatus>((value) => statuses.some((status) => status === value));
}
