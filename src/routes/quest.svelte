<script lang="ts">
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
      // Lazy load heavy libraries only when needed
      const [{ default: JSZip }, { default: axios }, { default: saveAs }] = await Promise.all([
         import('jszip'),
         import('axios'),
         import('file-saver')
      ]);
      
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

<div class="quest-installer">
   <div class="quest-container">
      <div class="quest-card">
         <div class="quest-header">
            <h2 class="quest-title">{getStepTitle($pageQuery.step)}</h2>
            <div class="quest-progress">
               <div class="progress-bar">
                  <div class="progress-fill" style="width: {($pageQuery.step / maxPages) * 100}%" />
               </div>
               <span class="progress-text">Step {$pageQuery.step} of {maxPages}</span>
            </div>
         </div>

         <div class="quest-content">
            {#if $pageQuery.step == 1}
               <p class="quest-text">Following these steps will install ScoreSaber on Quest for Beat Saber</p>
               <p class="quest-text">Click Next to continue</p>
            {/if}

            {#if $pageQuery.step == 2}
               {#if $userData}
                  <p class="quest-text">Currently logged in as <strong>{$userData.playerId}</strong>. Click next to continue</p>
               {:else}
                  <p class="quest-text">To install ScoreSaber on Quest you must link your Steam account. Please click the button below to sign in</p>
                  <a href="{API_URL}/api/auth/steam/quest" class="quest-button primary">
                     <i class="fab fa-steam" />
                     <span>Sign In with Steam</span>
                  </a>
               {/if}
            {/if}

            {#if $pageQuery.step == 3}
               <div class="quest-warning">
                  <div class="warning-icon">
                     <i class="fa fa-exclamation-triangle" />
                  </div>
                  <div class="warning-content">
                     <h4 class="warning-title">Warning</h4>
                     <p class="warning-text">Do not share these files with anyone as they contain your login details!</p>
                  </div>
               </div>
               <p class="quest-text">
                  By downloading ScoreSaber you agree that you have read & agreed to the{' '}
                  <a rel="noopener noreferrer" target="_blank" href="https://scoresaber.com/legal/privacy" class="quest-link">Privacy Policy</a>
               </p>
               <div class="quest-table-wrapper">
                  <table class="quest-table">
                     <thead>
                        <tr>
                           <th>ScoreSaber Version</th>
                           <th>Beat Saber Version</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each availableVersions as version}
                           <tr>
                              <td><strong>ScoreSaber {version[0]}</strong></td>
                              <td>{version[1]}</td>
                              <td>
                                 <button on:click={() => generateQmod(version[0], version[1])} class="quest-button download">
                                    <i class="fas fa-file-download" />
                                    <span>Generate & Download</span>
                                 </button>
                              </td>
                           </tr>
                        {/each}
                     </tbody>
                  </table>
               </div>
               <p class="quest-text">The next page will show you how to install ScoreSaber</p>
            {/if}

            {#if $pageQuery.step == 4}
               <p class="quest-text">This guide assumes you are using <a href="https://mbf.bsquest.xyz/" class="quest-link" target="_blank" rel="noopener">MBF</a> to mod your game</p>
               <p class="quest-text">Connect your Quest to your PC or phone and open MBF</p>
               <div class="quest-image-wrapper">
                  <img alt="MBF Start Screen" src="/images/quest-install/mbf_start.png" class="quest-image" />
               </div>
               <p class="quest-text">
                  Click <strong>Connect to Quest</strong> and select your Quest in the popup that follows. You should see the following screen (you might have to
                  press on <strong>Add Mods</strong> first):
               </p>
               <div class="quest-image-wrapper">
                  <img alt="MBF Mods Screen" src="/images/quest-install/mbf.png" class="quest-image" />
               </div>
               <p class="quest-text">Now use the <strong>Upload Files</strong> button to upload your ScoreSaber qmod</p>
               <p class="quest-text">After it is done installing you should be good to go!</p>
            {/if}
         </div>

         <div class="quest-actions">
            {#if $pageQuery.step > 1}
               <button on:click={previous} class="quest-button secondary">
                  <i class="fas fa-arrow-left" />
                  <span>Previous</span>
               </button>
            {/if}

            {#if $pageQuery.step < maxPages}
               {#if !$userData}
                  {#if $pageQuery.step < 2}
                     <button on:click={next} class="quest-button primary">
                        <span>Next</span>
                        <i class="fas fa-arrow-right" />
                     </button>
                  {/if}
               {:else}
                  <button on:click={next} class="quest-button primary">
                     <span>Next</span>
                     <i class="fas fa-arrow-right" />
                  </button>
               {/if}
            {/if}
         </div>
      </div>

      <div class="quest-card">
         <div class="quest-footer-content">
            <a target="_blank" rel="external" href="https://patreon.com/scoresaber" class="quest-footer-link">
               <i class="fab fa-patreon" />
               <span>Please consider supporting ScoreSaber on Patreon <span aria-label="heart" role="img">❤️</span></span>
            </a>
            <p class="quest-footer-note">You can get custom profile bios, a fancy leaderboard colour, badge and role</p>
            <a target="_blank" rel="external" href="https://github.com/ScoreSaber/ScoreSaber-Quest" class="quest-footer-link">
               <i class="fab fa-github" />
               <span>Source Code</span>
            </a>
         </div>
      </div>
   </div>
</div>

<style>
   .quest-installer {
      padding: 2rem 1.5rem;
   }

   .quest-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
   }

   .quest-card {
      background: var(--foreground);
      border: 1px solid var(--borderColor);
      border-radius: 0.9rem;
      padding: 2rem;
   }

   .quest-header {
      margin-bottom: 2rem;
   }

   .quest-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--textColor);
      margin: 0 0 1rem 0;
   }

   .quest-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
   }

   .progress-bar {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 999px;
      overflow: hidden;
   }

   .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--scoreSaberYellow), rgba(255, 215, 0, 0.8));
      border-radius: 999px;
      transition: width 0.3s ease;
   }

   .progress-text {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      white-space: nowrap;
   }

   .quest-content {
      margin-bottom: 2rem;
   }

   .quest-text {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.6;
      margin: 0 0 1rem 0;
   }

   .quest-text:last-child {
      margin-bottom: 0;
   }

   .quest-link {
      color: var(--scoreSaberYellow);
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .quest-link:hover {
      color: #ffed4e;
   }

   .quest-warning {
      display: flex;
      gap: 1rem;
      padding: 1.25rem;
      background: rgba(255, 193, 7, 0.1);
      border: 1px solid rgba(255, 193, 7, 0.3);
      border-radius: 0.75rem;
      margin-bottom: 1.5rem;
   }

   .warning-icon {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 193, 7, 0.2);
      border-radius: 50%;
      color: #ffc107;
      font-size: 1.1rem;
   }

   .warning-content {
      flex: 1;
   }

   .warning-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffc107;
      margin: 0 0 0.5rem 0;
   }

   .warning-text {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      line-height: 1.5;
   }

   .quest-table-wrapper {
      overflow-x: auto;
      margin: 1.5rem 0;
   }

   .quest-table {
      width: 100%;
      border-collapse: collapse;
   }

   .quest-table thead {
      background: var(--foregroundItem);
   }

   .quest-table th {
      padding: 0.85rem 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--textColor);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
   }

   .quest-table td {
      padding: 1rem;
      color: rgba(255, 255, 255, 0.85);
      border-top: 1px solid var(--borderColor);
   }

   .quest-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.03);
   }

   .quest-image-wrapper {
      margin: 1.5rem 0;
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid var(--borderColor);
   }

   .quest-image {
      width: 100%;
      height: auto;
      display: block;
   }

   .quest-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--borderColor);
   }

   .quest-button {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.85rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border: 0;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
      font-family: inherit;
   }

   .quest-button.primary {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 166, 0, 0.95));
      color: #0c0c0f;
      margin-left: auto;
   }

   .quest-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
   }

   .quest-button.secondary {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
   }

   .quest-button.secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: var(--scoreSaberYellow);
      color: var(--scoreSaberYellow);
   }

   .quest-button.download {
      background: rgba(255, 215, 0, 0.15);
      border: 1px solid rgba(255, 215, 0, 0.3);
      color: var(--scoreSaberYellow);
      padding: 0.65rem 1.25rem;
      font-size: 0.9rem;
   }

   .quest-button.download:hover {
      background: rgba(255, 215, 0, 0.2);
      border-color: var(--scoreSaberYellow);
   }

   .quest-footer-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-align: center;
   }

   .quest-footer-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      color: var(--textColor);
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 500;
   }

   .quest-footer-link:hover {
      color: var(--scoreSaberYellow);
   }

   .quest-footer-note {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
   }

   @media (max-width: 768px) {
      .quest-installer {
         padding: 1.5rem 1rem;
      }

      .quest-card {
         padding: 1.5rem;
      }

      .quest-title {
         font-size: 1.5rem;
      }

      .quest-progress {
         flex-direction: column;
         align-items: stretch;
         gap: 0.5rem;
      }

      .progress-text {
         text-align: center;
      }

      .quest-actions {
         flex-direction: column;
      }

      .quest-button.primary {
         margin-left: 0;
         width: 100%;
         justify-content: center;
      }

      .quest-table-wrapper {
         margin: 1rem -1.5rem;
         padding: 0 1.5rem;
      }

      .quest-table {
         font-size: 0.9rem;
      }

      .quest-table th,
      .quest-table td {
         padding: 0.75rem 0.5rem;
      }
   }
</style>
