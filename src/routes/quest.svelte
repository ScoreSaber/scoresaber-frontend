<script lang="ts">
   import JSZip from 'jszip';
   import axios from 'axios';
   import { saveAs } from 'file-saver';

   import { setBackground, userData } from '$lib/stores/global-store';
   import { pageQueryStore } from '$lib/stores/query-store';

   import { CDN_URL, API_URL } from '$lib/utils/env';
   import fetcher from '$lib/utils/fetcher';

   setBackground('/images/banner.jpg');

   const maxPages = 4;

   const availableVersions = [
      ['2.4.0', '1.37.0_9064817954'],
      ['2.3.0', '1.28.0_4124311467'],
      ['2.2.0', '1.28.0_4124311467'],
      ['2.1.0', '1.27.0_3631150051']
   ];

   $: pageQuery = pageQueryStore({
      step: 1
   });

   async function generateQmod(modVersion, gameVersion) {
      const questKey = await fetcher('/api/user/quest-key', { withCredentials: true });
      const data = await axios.get(CDN_URL + `/downloads/quest/ScoreSaber_${gameVersion}_${modVersion}.qmod`, { responseType: 'blob' });
      const zip = new JSZip();
      await zip.loadAsync(data.data as Blob);
      zip.file('scoresaber_DO_NOT_SHARE.scary', `${questKey}:${$userData.playerId}`);
      zip.generateAsync({ type: 'blob', mimeType: 'application/qmod' }).then(function (content) {
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

<head> <title>Quest Installer | ScoreSaber!</title></head>

<div class="section">
   <div class="window-header">{getStepTitle($pageQuery.step)}</div>
   <div class="window has-shadow">
      {#if $pageQuery.step == 1}
         <p>Following these steps will install ScoreSaber on Quest for Beat Saber</p>
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
            <b>Do not share these files with anyone as they contain your login details!</b>
         </div>
         <p>
            By downloading ScoreSaber you agree that you have read & agreed to the <a
               rel="noopener noreferrer"
               target="_blank"
               href="https://scoresaber.com/legal/privacy">Privacy Policy</a
            >
         </p>
         <table>
            <thead>
               <tr class="headers">
                  <th>ScoreSaber Version</th>
                  <th>BeatSaber Version</th>
               </tr>
            </thead>
            <tbody>
               {#each availableVersions as version}
                  <tr class="table-item">
                     <td>ScoreSaber {version[0]}</td>
                     <td>BeatSaber {version[1]}</td>
                     <td>
                        <button on:click={() => generateQmod(version[0], version[1])} class="button is-link is-small">
                           <span class="icon">
                              <i class="fas fa-file-download" />
                           </span>
                           <span>Generate & Download</span>
                        </button>
                     </td>
                  </tr>
               {/each}
            </tbody>
         </table>
         <p>The next page will show you how to install ScoreSaber.</p>
      {/if}

      {#if $pageQuery.step == 4}
         <p>This guide assumes you are using <a href="https://mbf.bsquest.xyz/">MBF</a> to mod your game.</p>
         <p>Connect your Quest to your PC or phone and open MBF.</p>
         <img alt="" src="/images/quest-install/mbf_start.png" />
         <p>
            Click <b>Connect to Quest</b> and select your Quest in the popup that follows. You should see the following screen (you might have to
            press on <b>Add Mods</b> first):
         </p>
         <img alt="" src="/images/quest-install/mbf.png" />
         <p>Now use the <b>Upload Files</b> button to upload your ScoreSaber qmod.</p>
         <p>After it is done installing you should be good to go!</p>
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
         <a target="_blank" rel="external" href="https://patreon.com/scoresaber">
            Please consider supporting ScoreSaber on Patreon{' '}
            <span aria-label="heart" role="img"> ❤️ </span>{' '}
            (you can get custom profile bios, a fancy leaderboard colour, badge and role){' '}
         </a>
      </p>
      <p>
         <a target="_blank" rel="external" href="https://github.com/ScoreSaber/ScoreSaber-Quest">
            <div class="icon-link">
               <i class="fab fa-github fa-2x" />
               <span class="mt-1 ml-2">Source Code</span>
            </div>
         </a>
      </p>
   </div>
</div>

<style>
   .icon-link {
      display: flex;
      align-items: left;
      justify-content: left;
      text-align: left;
   }
   .warning {
      color: red;
   }
</style>
