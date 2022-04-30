<script lang="ts">
   import { setBackground, userData } from '$lib/global-store';
   import { CDN_URL, API_URL } from '$lib/utils/env';
   import { pageQueryStore } from '$lib/query-store';
   import { saveAs } from 'file-saver';
   import fetcher from '$lib/utils/fetcher';
   import JSZip from 'jszip';
   import axios from 'axios';

   setBackground('/images/banner.jpg');

   const maxPages = 4;

   $: pageQuery = pageQueryStore({
      step: 1
   });

   async function generateQmod() {
      const questKey = await fetcher('/api/user/quest-key', { withCredentials: true });
      const data = await axios.get(CDN_URL + '/downloads/quest/ScoreSaber_1.17.1_1.0.0.qmod', { responseType: 'blob' });
      const zip = new JSZip();
      await zip.loadAsync(data.data as Blob);
      zip.file('scoresaber_DO_NOT_SHARE.scary', `${questKey}:${$userData.playerId}`);
      zip.generateAsync({ type: 'blob' }).then(function (content) {
         saveAs(content, 'ScoreSaber_DO_NOT_SHARE.qmod');
      });
   }

   function next() {
      if ($pageQuery.step < maxPages) {
         pageQuery.updateSingle('step', $pageQuery.step + 1);
      }
   }

   function previous() {
      if ($pageQuery.step > 1) {
         pageQuery.updateSingle('step', $pageQuery.step - 1);
      }
   }

   function getStepTitle(step: number): string {
      switch (step) {
         case 1:
            return 'Welcome to the ScoreSaber Quest downloader';
         case 2:
            return 'Sign in';
         case 3:
            return 'Your download';
         case 4:
            return 'Installation Instructions';
         default:
            break;
      }
   }
</script>

<head> Quest Installer | ScoreSaber! </head>

<div class="section">
   <div class="window-header">{getStepTitle($pageQuery.step)}</div>
   <div class="window has-shadow">
      {#if $pageQuery.step == 1}
         <p>Following these steps will install ScoreSaber on Quest for Beat Saber 1.17.1</p>
         <p>
            <b>It is recommended that you uninstall any other conflicting leaderboard mods before continuuing as they are not currently supported</b>
         </p>
         <p>Click Next to continue</p>
      {/if}

      {#if $pageQuery.step == 2}
         {#if $userData}
            Currently logged in as {$userData.playerId} click next to continue
         {:else}
            <p>To install ScoreSaber on Quest you must link your steam account, please click the button below to sign in</p>
            <a href="{API_URL}/api/auth/steam/quest">
               <button class="button is-small">
                  <span class="icon">
                     <i class="fab fa-steam" />
                  </span>
                  <span>Sign In</span>
               </button>
            </a>
         {/if}
      {/if}

      {#if $pageQuery.step == 3}
         <div class="notification is-warning download">
            <h4 class="warning">!! Warning !!</h4>
            <b>Do not share this file with anyone as it contains your login details!</b>
         </div>
         <p>
            By downloading ScoreSaber you agree that you have read & agreed to the <a
               rel="noopener noreferrer"
               target="_blank"
               href="https://scoresaber.com/legal/privacy">Privacy Policy</a
            >
         </p>
         <button on:click={() => generateQmod()} class="button is-link is-small">
            <span class="icon">
               <i class="fas fa-file-download" />
            </span>
            <span>Generate & Download</span>
         </button>
      {/if}

      {#if $pageQuery.step == 4}
         <div class="notification is-info download">
            <h4>Note:</h4>
            <b>Make sure your Quest and PC are on the same network!</b>
         </div>
         <p>
            Open BMBF on your Quest and go to the <b>Tools</b> tab, there you should see a web address and a version number similar to what's show below.
         </p>
         <img alt="" src="/images/quest-install/quest-ip.png" />
         <p>On your PC, open your browser and type the address into the search bar and navigate to the upload tab.</p>
         <p>You should be greeted with this screen below.</p>
         <img alt="" src="/images/quest-install/bmbf.png" width="900" />
         <p>Now just download and drag your ScoreSaber qmod into the upload box and sync.</p>
      {/if}

      <hr />

      {#if $pageQuery.step > 1}
         <button
            on:click={() => {
               previous();
            }}
            class="button is-link is-small"
         >
            <span class="icon">
               <i class="fas fa-arrow-left" />
            </span>
            <span>Previous</span>
         </button>
      {/if}

      {#if $pageQuery.step < maxPages}
         {#if !$userData}
            {#if $pageQuery.step < 2}
               <button
                  on:click={() => {
                     next();
                  }}
                  class="button is-link is-small"
               >
                  <span class="icon">
                     <i class="fas fa-arrow-right" />
                  </span>
                  <span>Next</span>
               </button>
            {/if}
         {:else}
            <button
               on:click={() => {
                  next();
               }}
               class="button is-link is-small"
            >
               <span class="icon">
                  <i class="fas fa-arrow-right" />
               </span>
               <span>Next</span>
            </button>
         {/if}
      {/if}
   </div>

   <div class="window has-shadow">
      <p>
         <a href="https://patreon.com/scoresaber">
            Please consider supporting ScoreSaber on Patreon{' '}
            <span aria-label="heart" role="img"> ❤️ </span>{' '}
            (you can get custom profile bios, a fancy leaderboard colour, badge and role){' '}
         </a>
      </p>
   </div>
</div>

<style>
   .warning {
      color: red;
   }
</style>
