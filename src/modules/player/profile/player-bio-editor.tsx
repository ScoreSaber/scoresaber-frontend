'use client';

import { useState } from 'react';

import { FaPen } from 'react-icons/fa';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { PlayerBio } from '@/modules/player/profile/player-bio';
import { updateBio } from '@/modules/settings/actions/account';
import { BioEditorForm } from '@/shared/components/bio-editor-form';
import { sanitizeRichTextHtml } from '@/shared/rich-text';

interface PlayerBioEditorProps {
   bio: string;
}

const bioMaxLength = 4096;

export function PlayerBioEditor({ bio }: PlayerBioEditorProps) {
   const t = useTranslations();
   const tc = useTranslations();
   const ts = useTranslations();
   const [editing, setEditing] = useState(false);
   const [value, setValue] = useState(bio);

   const mutation = useActionMutation();

   function handleCancel() {
      setValue(bio);
      mutation.reset();
      setEditing(false);
   }

   if (!editing) {
      return (
         <div className="group relative">
            {bio ? <PlayerBio sanitizedBio={sanitizeRichTextHtml(bio)} /> : <p className="text-muted-foreground text-sm">{t('player.noBioSet')}</p>}
            <Button
               variant="ghost"
               size="icon-xs"
               onClick={() => setEditing(true)}
               className="absolute top-0 right-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
               <FaPen data-icon />
            </Button>
         </div>
      );
   }

   const invalid = value.length > bioMaxLength;

   return (
      <BioEditorForm
         value={value}
         onValueChangeAction={setValue}
         placeholder={t('player.writeBio')}
         countLabel={ts('settings.account.bioCount', { count: value.length, max: bioMaxLength })}
         saveLabel={tc('common.save')}
         saveDisabled={mutation.isPending || invalid}
         savePending={mutation.isPending}
         onSaveAction={() =>
            mutation.mutate(() => updateBio(value), {
               onSuccess: () => {
                  toast.success(t('player.bioUpdated'));
                  setEditing(false);
               }
            })
         }
         invalid={invalid}
         cancelLabel={tc('common.cancel')}
         onCancelAction={handleCancel}
         error={mutation.error}
      />
   );
}
