'use client';

import type { ReactNode, SubmitEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { getRouteApi, useRouter } from '@tanstack/react-router';
import { AtSign, ChevronRight, FileText, ImageUp, Loader2, LogIn, RotateCcw, Save, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { PlayerAvatar } from '@/modules/player/shared/player-avatar';
import { requestCountryReset, updateBio, updateName, uploadAvatar } from '@/modules/settings/actions/account';
import { claimVanity } from '@/modules/settings/actions/vanity';
import type { UserControllerCanResetCountryResponse, UserControllerGetVanityResponse } from '@/shared/api/generated/ApiParams';
import { ConditionalOverlay } from '@/shared/components/conditional-overlay';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { dynamic } from '@/shared/components/dynamic';
import { SupporterFeatureLock } from '@/shared/components/supporter-feature-lock';
import { SupporterRequiredOverlay } from '@/shared/components/supporter-required-overlay';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import Permissions from '@/shared/permissions';

interface AccountSectionProps {
   countryReset: UserControllerCanResetCountryResponse | null;
   vanity: UserControllerGetVanityResponse | null;
   patreonConnected: boolean;
   beforeActions?: ReactNode;
}

const bioMaxLength = 4096;
const countryResetCooldownDays = 30;
const avatarMaxSize = 10 * 1024 * 1024;
const iconClass = 'border-border/60 bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full border';
const loginRoute = getRouteApi('/login');
const settingsAccountRoute = getRouteApi('/settings/account');
const playerRoute = getRouteApi('/u/$playerId');
const BioEditorForm = dynamic(() => import('@/shared/components/bio-editor-form').then((mod) => mod.BioEditorForm));

export function AccountSection({ countryReset, vanity, patreonConnected, beforeActions }: AccountSectionProps) {
   const t = useTranslations();
   const tSidebar = useTranslations();
   const router = useRouter();
   const { user } = useAuth();
   const mutation = useActionMutation();
   const avatarInputRef = useRef<HTMLInputElement>(null);
   const [name, setName] = useState(user?.name ?? '');
   const [vanitySlug, setVanitySlug] = useState('');
   const [bio, setBio] = useState(user?.bio ?? '');
   const [avatarFile, setAvatarFile] = useState<File | null>(null);
   const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
   const [countryResetOpen, setCountryResetOpen] = useState(false);
   const [bioOpen, setBioOpen] = useState(false);
   const [bioEditorMounted, setBioEditorMounted] = useState(false);

   useEffect(() => {
      if (!avatarFile) {
         setAvatarPreviewUrl(null);
         return;
      }

      const previewUrl = URL.createObjectURL(avatarFile);
      setAvatarPreviewUrl(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
   }, [avatarFile]);

   if (!user) {
      return (
         <div className="flex flex-col items-center justify-center py-12">
            <Button asChild className="cursor-pointer">
               <loginRoute.Link search={{ redirectTo: settingsAccountRoute.id }}>
                  <LogIn data-icon="inline-start" />
                  {tSidebar('sidebar.logIn')}
               </loginRoute.Link>
            </Button>
         </div>
      );
   }

   const trimmedName = name.trim();
   const nameChanged = trimmedName.length > 0 && trimmedName !== user.name;
   const nameSaveDisabled = mutation.isPending || !nameChanged;
   const nameSavePending = mutation.isPendingKey('name');
   const vanitySavePending = mutation.isPendingKey('vanity');
   const vanityCanChangeAt = vanity?.canChangeAt;
   const vanityCooldownActive = vanityCanChangeAt ? Date.parse(vanityCanChangeAt) > Date.now() : false;
   const canChangeVanity = !!vanity && !vanityCooldownActive;
   const trimmedVanitySlug = vanitySlug.trim().toLowerCase();
   const vanityChanged = trimmedVanitySlug.length > 0 && trimmedVanitySlug !== vanity?.slug;
   const vanitySaveDisabled = mutation.isPending || !canChangeVanity || trimmedVanitySlug.length < 3 || !vanityChanged;
   const bioChanged = bio !== (user.bio ?? '');
   const bioInvalid = bio.length > bioMaxLength;
   const bioSavePending = mutation.isPendingKey('bio');
   const bioSaveDisabled = mutation.isPending || !bioChanged || bioInvalid;
   const avatarSavePending = mutation.isPendingKey('avatar');
   const avatarSaveDisabled = mutation.isPending || !avatarFile;
   const countryResetPending = mutation.isPendingKey('country-reset');
   const countryResetAvailableAt = getCountryResetAvailableAt(countryReset?.lastReset);
   const canUseProfilePerks = Permissions.isSupporter(user.permissions);
   const canEditBio = canUseProfilePerks;
   const saveName = () => {
      if (nameSaveDisabled) {
         return;
      }

      mutation.runKeyed('name', () => updateName(trimmedName), t('settings.account.nameSaved'), t('settings.account.nameSaveFailed'));
   };
   const saveVanity = (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (vanitySaveDisabled) {
         return;
      }

      mutation.runKeyed(
         'vanity',
         () => claimVanity(trimmedVanitySlug),
         t('settings.perks.vanity.claimed'),
         t('settings.perks.vanity.claimFailed'),
         () => {
            setVanitySlug('');
            void router.invalidate();
         }
      );
   };
   const saveAvatar = () => {
      if (avatarSaveDisabled || !avatarFile) {
         return;
      }

      const formData = new FormData();
      formData.set('avatar', avatarFile);
      mutation.runKeyed(
         'avatar',
         () => uploadAvatar(formData),
         t('settings.account.avatarSaved'),
         t('settings.account.avatarSaveFailed'),
         () => void router.invalidate().finally(clearAvatarFile)
      );
   };
   const clearAvatarFile = () => {
      setAvatarFile(null);
      if (avatarInputRef.current) {
         avatarInputRef.current.value = '';
      }
   };
   const selectAvatarFile = (file: File | null) => {
      if (!file) {
         setAvatarFile(null);
         return;
      }

      if (file.size > avatarMaxSize) {
         toast.error(t('settings.account.avatarTooLarge'));
         clearAvatarFile();
         return;
      }

      setAvatarFile(file);
   };
   const resetCountry = () => {
      mutation.runKeyed(
         'country-reset',
         requestCountryReset,
         t('settings.account.countryResetQueued'),
         t('settings.account.countryResetFailed'),
         () => setCountryResetOpen(false)
      );
   };
   const changeBioOpen = (open: boolean) => {
      setBioOpen(open);
      if (open) {
         setBioEditorMounted(true);
      }
   };

   return (
      <>
         <div className="flex flex-col gap-4">
            <Card variant="settings" className="gap-4 py-5">
               <CardHeader className="px-5">
                  <CardTitle className="text-base">{t('settings.account.detailsTitle')}</CardTitle>
               </CardHeader>
               <CardContent className="flex flex-col px-5">
                  <div className="border-border/70 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center">
                     <PlayerAvatar
                        src={avatarPreviewUrl ?? user.avatar}
                        version={avatarPreviewUrl ? undefined : user.avatarVersion}
                        alt={user.name}
                        width={104}
                        height={104}
                        className="size-[104px] rounded-full"
                     />

                     <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex min-h-10 min-w-0 flex-col justify-center">
                           <label htmlFor="account-avatar" className="leading-5 font-semibold">
                              {t('settings.account.profilePicture')}
                           </label>
                           <p className="text-muted-foreground text-sm">{t('settings.account.avatarHelper')}</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Input
                           ref={avatarInputRef}
                           id="account-avatar"
                           type="file"
                           accept="image/*"
                           disabled={mutation.isPending}
                           onChange={(event) => selectAvatarFile(event.target.files?.[0] ?? null)}
                           className="sr-only"
                        />
                        <Button
                           type="button"
                           variant="outline"
                           disabled={mutation.isPending}
                           onClick={() => avatarInputRef.current?.click()}
                           className="cursor-pointer"
                        >
                           <ImageUp data-icon="inline-start" />
                           {t('settings.account.changePhoto')}
                        </Button>
                        {avatarFile && (
                           <>
                              <Button
                                 type="button"
                                 variant="outline"
                                 disabled={mutation.isPending}
                                 onClick={clearAvatarFile}
                                 aria-label={t('settings.account.resetAvatar')}
                                 className="cursor-pointer"
                              >
                                 <RotateCcw data-icon="inline-start" />
                                 {t('settings.account.reset')}
                              </Button>
                              <Button type="button" disabled={avatarSaveDisabled} onClick={saveAvatar} className="cursor-pointer sm:w-24">
                                 {avatarSavePending ? (
                                    <Loader2 data-icon="inline-start" className="animate-spin" />
                                 ) : (
                                    <Save data-icon="inline-start" />
                                 )}
                                 {t('common.save')}
                              </Button>
                           </>
                        )}
                     </div>
                  </div>

                  <div className="border-border/70 flex flex-col gap-4 border-b py-5 lg:grid lg:grid-cols-[minmax(12rem,1fr)_minmax(18rem,42rem)] lg:items-center">
                     <div className="flex min-w-0 gap-4">
                        <span className={iconClass}>
                           <UserRound className="size-5" aria-hidden />
                        </span>
                        <div className="flex min-h-10 min-w-0 flex-col justify-center">
                           <label htmlFor="account-display-name" className="leading-5 font-semibold">
                              {t('settings.account.displayName')}
                           </label>
                        </div>
                     </div>

                     <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                        <InputGroup className="min-w-0 flex-1">
                           <InputGroupInput
                              id="account-display-name"
                              value={name}
                              onChange={(event) => setName(event.target.value)}
                              onKeyDown={(event) => {
                                 if (event.key !== 'Enter') {
                                    return;
                                 }

                                 event.preventDefault();
                                 saveName();
                              }}
                              maxLength={128}
                              autoComplete="nickname"
                           />
                           <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                 variant="ghost-icon"
                                 size="icon-xs"
                                 disabled={!nameChanged}
                                 onClick={() => setName(user.name)}
                                 aria-label={t('settings.account.resetName')}
                                 className="cursor-pointer rounded-full"
                              >
                                 <RotateCcw />
                              </InputGroupButton>
                           </InputGroupAddon>
                        </InputGroup>
                        <Button type="button" disabled={nameSaveDisabled} onClick={saveName} className="cursor-pointer sm:w-24">
                           {nameSavePending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Save data-icon="inline-start" />}
                           {t('common.save')}
                        </Button>
                     </div>
                  </div>

                  <SupporterFeatureLock
                     locked={!canUseProfilePerks}
                     patreonConnected={patreonConnected}
                     variant="field"
                     className="border-border/70 border-b"
                     contentClassName="py-5"
                     title={t('settings.perks.vanity.lockTitle')}
                     description={t('settings.perks.vanity.lockDescription')}
                  >
                     <form
                        className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(12rem,1fr)_minmax(18rem,42rem)] lg:items-start"
                        onSubmit={saveVanity}
                     >
                        <div className="flex min-w-0 gap-4">
                           <span className={iconClass}>
                              <AtSign className="size-5" aria-hidden />
                           </span>
                           <div className="flex min-h-10 min-w-0 flex-col justify-center gap-1">
                              <label htmlFor="account-vanity-slug" className="leading-5 font-semibold">
                                 {t('settings.perks.vanity.title')}
                              </label>
                              {vanity?.slug ? (
                                 <p className="text-muted-foreground text-sm">
                                    {t('settings.perks.vanity.current')}{' '}
                                    <playerRoute.Link
                                       params={{ playerId: vanity.slug }}
                                       className="text-primary font-medium underline-offset-4 hover:underline"
                                    >
                                       /u/{vanity.slug}
                                    </playerRoute.Link>
                                 </p>
                              ) : !vanity ? (
                                 <p className="text-muted-foreground text-sm text-pretty">{t('settings.perks.vanity.loadFailed')}</p>
                              ) : null}
                              {vanityCooldownActive && vanityCanChangeAt && (
                                 <p className="text-muted-foreground text-sm text-pretty">
                                    {t.rich('settings.perks.vanity.cooldown', { date: () => <Time date={vanityCanChangeAt} dateStyle="long" /> })}
                                 </p>
                              )}
                           </div>
                        </div>

                        {vanity && (
                           <div className="flex min-w-0 flex-col gap-2">
                              <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                                 <InputGroup
                                    data-disabled={!canUseProfilePerks || !canChangeVanity || mutation.isPending || undefined}
                                    className="min-w-0 flex-1"
                                 >
                                    <InputGroupAddon align="inline-start">/u/</InputGroupAddon>
                                    <InputGroupInput
                                       id="account-vanity-slug"
                                       value={vanitySlug}
                                       minLength={3}
                                       maxLength={32}
                                       placeholder={vanity.slug || t('settings.perks.vanity.placeholder')}
                                       disabled={!canUseProfilePerks || !canChangeVanity || mutation.isPending}
                                       autoComplete="off"
                                       spellCheck={false}
                                       onChange={(event) => setVanitySlug(event.target.value)}
                                    />
                                    <InputGroupAddon align="inline-end">
                                       <InputGroupButton
                                          variant="ghost-icon"
                                          size="icon-xs"
                                          disabled={!vanitySlug}
                                          onClick={() => setVanitySlug('')}
                                          aria-label={t('settings.account.reset')}
                                          className="cursor-pointer rounded-full"
                                       >
                                          <RotateCcw />
                                       </InputGroupButton>
                                    </InputGroupAddon>
                                 </InputGroup>
                                 <Button type="submit" disabled={vanitySaveDisabled || !canUseProfilePerks} className="cursor-pointer sm:w-24">
                                    {vanitySavePending ? (
                                       <Loader2 data-icon="inline-start" className="animate-spin" />
                                    ) : (
                                       <Save data-icon="inline-start" />
                                    )}
                                    {vanity.slug ? t('settings.perks.vanity.change') : t('settings.perks.vanity.claim')}
                                 </Button>
                              </div>
                           </div>
                        )}
                     </form>
                  </SupporterFeatureLock>

                  <Collapsible open={bioOpen} onOpenChange={changeBioOpen}>
                     <CollapsibleTrigger asChild>
                        <button
                           type="button"
                           className="hover:bg-accent/30 -mx-3 mt-2 flex w-[calc(100%+1.5rem)] items-center justify-between gap-4 rounded-md px-3 py-3 text-left transition-colors"
                        >
                           <div className="flex min-w-0 gap-4">
                              <span className={iconClass}>
                                 <FileText className="size-5" aria-hidden />
                              </span>
                              <div className="flex min-h-10 min-w-0 flex-col justify-center">
                                 <h3 className="leading-5 font-semibold">{t('settings.account.bio')}</h3>
                              </div>
                           </div>
                           <ChevronRight
                              className={cn('text-muted-foreground size-4 shrink-0 transition-transform', bioOpen && 'rotate-90')}
                              aria-hidden
                           />
                        </button>
                     </CollapsibleTrigger>
                     <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-2">
                        {bioEditorMounted && (
                           <ConditionalOverlay
                              shouldShow={() => !canEditBio}
                              component={SupporterRequiredOverlay}
                              componentProps={{ patreonConnected }}
                              className="rounded-md"
                              overlayClassName="min-h-36"
                           >
                              <BioEditorForm
                                 id="account-bio"
                                 value={bio}
                                 onValueChangeAction={setBio}
                                 placeholder={t('settings.account.writeBio')}
                                 countLabel={t('settings.account.bioCount', { count: bio.length, max: bioMaxLength })}
                                 saveLabel={t('common.save')}
                                 saveDisabled={bioSaveDisabled}
                                 savePending={bioSavePending}
                                 onSaveAction={() =>
                                    mutation.runKeyed(
                                       'bio',
                                       () => updateBio(bio),
                                       t('settings.account.bioSaved'),
                                       t('settings.account.bioSaveFailed')
                                    )
                                 }
                                 disabled={!canEditBio}
                                 invalid={bioInvalid}
                                 hideActions={!canEditBio}
                              />
                           </ConditionalOverlay>
                        )}
                     </CollapsibleContent>
                  </Collapsible>
               </CardContent>
            </Card>

            {beforeActions}

            <Card variant="settings" className="gap-4 py-5">
               <CardHeader className="px-5">
                  <CardTitle className="text-base">{t('settings.account.actionsTitle')}</CardTitle>
               </CardHeader>
               <CardContent className="px-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                     <div className="flex min-w-0 gap-4">
                        <span className="border-destructive/30 bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-full border">
                           {countryResetPending ? (
                              <Loader2 className="size-5 animate-spin" aria-hidden />
                           ) : (
                              <RotateCcw className="size-5" aria-hidden />
                           )}
                        </span>
                        <div className="flex min-h-10 min-w-0 flex-col justify-center">
                           <h3 className="leading-5 font-semibold">
                              {countryReset?.canReset === false ? t('settings.account.resetCountryUnavailable') : t('settings.account.resetCountry')}
                           </h3>
                        </div>
                     </div>

                     <Button
                        type="button"
                        variant="outline"
                        disabled={mutation.isPending}
                        onClick={() => setCountryResetOpen(true)}
                        className="border-destructive/45 text-destructive hover:bg-destructive/10 hover:text-destructive w-fit"
                     >
                        {t('settings.account.reset')}
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         <ConfirmDialog
            open={countryResetOpen}
            onOpenChangeAction={setCountryResetOpen}
            title={t('settings.account.resetCountry')}
            description={t('settings.account.resetCountryDialogDesc', { days: countryResetCooldownDays })}
            confirmLabel={t('settings.account.resetCountry')}
            confirmationText={t('settings.account.resetCountryConfirmText')}
            pending={countryResetPending}
            variant="destructive"
            disabled={countryReset?.canReset === false}
            onConfirmAction={resetCountry}
         >
            <p className="text-muted-foreground text-sm text-pretty">
               {countryResetAvailableAt
                  ? t.rich('settings.account.resetCountryAvailableAt', {
                       date: () => <Time date={countryResetAvailableAt} dateStyle="medium" />
                    })
                  : t('settings.account.resetCountryHelper', { days: countryResetCooldownDays })}
            </p>
         </ConfirmDialog>
      </>
   );
}

function getCountryResetAvailableAt(lastReset: string | null | undefined) {
   if (!lastReset) {
      return null;
   }

   const resetDate = new Date(lastReset);
   if (Number.isNaN(resetDate.getTime())) {
      return null;
   }

   resetDate.setDate(resetDate.getDate() + countryResetCooldownDays);
   return resetDate;
}
