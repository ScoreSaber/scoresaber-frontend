'use client';

import { useState } from 'react';

import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { addOfficialBuildCompatibility } from '@/modules/admin/actions/admin';

export function VersionCompatibility() {
   const t = useTranslations('admin.versions');
   const action = useActionMutation();
   const [version, setVersion] = useState('');
   const gameVersion = version.trim();

   return (
      <section className="flex flex-col gap-5">
         <h2 className="font-semibold">{t('title')}</h2>

         <form
            className="flex flex-col items-start gap-3 rounded-md border p-4 sm:flex-row sm:items-end"
            onSubmit={(event) => {
               event.preventDefault();
               if (!gameVersion || action.isPending) return;

               action.run(
                  () => addOfficialBuildCompatibility(gameVersion),
                  t('updated'),
                  t('updateFailed'),
                  () => setVersion('')
               );
            }}
         >
            <div className="flex w-full max-w-sm flex-col gap-1.5">
               <Label htmlFor="beat-saber-version">{t('version')}</Label>
               <Input
                  id="beat-saber-version"
                  value={version}
                  onChange={(event) => setVersion(event.target.value)}
                  placeholder={t('versionPlaceholder')}
                  maxLength={16}
                  required
               />
            </div>
            <Button type="submit" disabled={!gameVersion || action.isPending}>
               {t('whitelist')}
            </Button>
         </form>
      </section>
   );
}
