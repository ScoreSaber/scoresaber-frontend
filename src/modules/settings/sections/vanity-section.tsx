'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';

import { getRouteApi, useRouter } from '@tanstack/react-router';
import { AtSign, Loader2, Save } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { claimVanity } from '@/modules/settings/actions/vanity';
import type { UserControllerGetVanityResponse } from '@/shared/api/generated/ApiParams';
import { Time } from '@/shared/components/time';

const playerRoute = getRouteApi('/u/$playerId');

interface VanitySectionProps {
   vanity: UserControllerGetVanityResponse | null;
}

export function VanitySection({ vanity }: VanitySectionProps) {
   const t = useTranslations();
   const router = useRouter();
   const mutation = useActionMutation<UserControllerGetVanityResponse>();
   const [slug, setSlug] = useState('');

   if (!vanity) {
      return (
         <Card variant="settings">
            <CardContent className="text-muted-foreground px-5 py-8 text-sm">{t('settings.perks.vanity.loadFailed')}</CardContent>
         </Card>
      );
   }

   const pending = mutation.isPendingKey('vanity');
   const cooldownActive = vanity.canChangeAt !== null && Date.parse(vanity.canChangeAt) > Date.now();
   const canChange = !cooldownActive;
   const trimmed = slug.trim().toLowerCase();
   const submitDisabled = pending || !canChange || trimmed.length < 3 || trimmed === vanity.slug;

   function submit(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      if (submitDisabled) {
         return;
      }

      mutation.runKeyed(
         'vanity',
         () => claimVanity(trimmed),
         t('settings.perks.vanity.claimed'),
         t('settings.perks.vanity.claimFailed'),
         () => {
            setSlug('');
            void router.invalidate();
         }
      );
   }

   return (
      <Card variant="settings" className="gap-4 py-5">
         <CardHeader className="px-5">
            <CardTitle className="text-base">{t('settings.perks.vanity.title')}</CardTitle>
            {canChange && <p className="text-muted-foreground text-sm text-pretty">{t('settings.perks.vanity.description')}</p>}
         </CardHeader>
         <CardContent className="flex flex-col gap-4 px-5">
            {vanity.slug && (
               <p className="text-sm">
                  {t('settings.perks.vanity.current')}{' '}
                  <playerRoute.Link params={{ playerId: vanity.slug }} className="text-primary font-medium underline-offset-4 hover:underline">
                     /u/{vanity.slug}
                  </playerRoute.Link>
               </p>
            )}

            {cooldownActive && vanity.canChangeAt && (
               <p className="text-muted-foreground text-sm text-pretty">
                  {t.rich('settings.perks.vanity.cooldown', { date: () => <Time date={vanity.canChangeAt} dateStyle="long" /> })}
               </p>
            )}

            {canChange && (
               <form className="flex max-w-md flex-col gap-2" onSubmit={submit}>
                  <Label htmlFor="vanity-slug">{vanity.slug ? t('settings.perks.vanity.changeLabel') : t('settings.perks.vanity.claimLabel')}</Label>
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                        <AtSign className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" aria-hidden />
                        <Input
                           id="vanity-slug"
                           value={slug}
                           minLength={3}
                           maxLength={32}
                           placeholder={t('settings.perks.vanity.placeholder')}
                           disabled={pending}
                           autoComplete="off"
                           spellCheck={false}
                           onChange={(event) => setSlug(event.target.value)}
                           className="pl-8"
                        />
                     </div>
                     <Button type="submit" disabled={submitDisabled} className="cursor-pointer">
                        {pending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Save data-icon="inline-start" />}
                        {vanity.slug ? t('settings.perks.vanity.change') : t('settings.perks.vanity.claim')}
                     </Button>
                  </div>
                  <p className="text-muted-foreground text-xs text-pretty">{t('settings.perks.vanity.rules')}</p>
               </form>
            )}
         </CardContent>
      </Card>
   );
}
