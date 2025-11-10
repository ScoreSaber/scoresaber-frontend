<script lang="ts">
   import { defaultBackground } from '$lib/stores/global-store';

   import Meta from '$lib/components/common/meta.svelte';

   import { rankedBatch, getYouTubeEmbedUrl, getBatchTitle, getReweightsUrl, getReweightsLinkText } from '$lib/config/ranked-batch';

   defaultBackground();
</script>

<head>
   <title>ScoreSaber!</title>
   <Meta
      title="ScoreSaber"
      description="Beat Saber's largest leaderboard system for custom songs, earn PP from ranked maps, and compare scores with others."
      image="https://scoresaber.com/512x512.png"
   />
</head>

<section class="hero-section">
   <div class="hero-banner" style="background-image: url('/images/banner.jpg');" />
   <div class="hero-content">
      <div class="hero-text">
         <h1 class="hero-title">Welcome to ScoreSaber!</h1>
         <p class="hero-description">
            The original leaderboard system for Beat Saber custom songs, officially released May 12th, 2018. As the largest and most established
            platform, ScoreSaber is the home for competitive Beat Saber players worldwide
         </p>
         <div class="hero-stats">
            <div class="stat">
               <div class="stat-value">85M+</div>
               <div class="stat-label">Scores</div>
            </div>
            <div class="stat">
               <div class="stat-value">280K+</div>
               <div class="stat-label">Leaderboards</div>
            </div>
            <div class="stat">
               <div class="stat-value">1.3M+</div>
               <div class="stat-label">Registered Players</div>
            </div>
         </div>
         <div class="hero-actions">
            <a href="/rankings" class="cta-primary">
               <i class="fa fa-medal" />
               <span>View Rankings</span>
            </a>
            <a href="/leaderboards" class="cta-secondary">
               <i class="fa fa-map" />
               <span>Browse Leaderboards</span>
            </a>
            <a href="https://wiki.scoresaber.com" class="cta-secondary" target="_blank" rel="noopener">
               <i class="fas fa-book-open" />
               <span>Wiki</span>
            </a>
         </div>
      </div>
   </div>
</section>

<section class="info-section">
   <div class="info-container">
      <h2 class="info-section-title">Get Started with ScoreSaber</h2>
      <p class="info-section-subtitle">Pick your platform and get ScoreSaber installed so you can start competing on custom song leaderboards</p>
      <div class="installation-grid">
         <div class="installation-card">
            <div class="installation-icon quest">
               <svg xmlns="http://www.w3.org/2000/svg" width="256" height="171" preserveAspectRatio="xMidYMid" viewBox="0 0 256 171">
                  <defs>
                     <linearGradient id="meta-a" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%">
                        <stop offset="0%" stop-color="#0064E1" />
                        <stop offset="40%" stop-color="#0064E1" />
                        <stop offset="83%" stop-color="#0073EE" />
                        <stop offset="100%" stop-color="#0082FB" />
                     </linearGradient>
                     <linearGradient id="meta-b" x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%">
                        <stop offset="0%" stop-color="#0082FB" />
                        <stop offset="100%" stop-color="#0064E0" />
                     </linearGradient>
                  </defs>
                  <path
                     fill="#0081FB"
                     d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z"
                  />
                  <path
                     fill="url(#meta-a)"
                     d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z"
                  />
                  <path
                     fill="url(#meta-b)"
                     d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z"
                  />
               </svg>
            </div>
            <h3>Meta Quest</h3>
            <p>Get ScoreSaber running on your Quest headset and jump into custom song leaderboards</p>
            <a href="/quest" class="installation-link">
               <span>Install on Quest</span>
               <i class="fa fa-arrow-right" />
            </a>
         </div>

         <div class="installation-card">
            <div class="installation-icon pc">
               <i class="fab fa-windows" />
            </div>
            <h3>PC (BSManager)</h3>
            <p>BSManager makes it easy to install and manage mods on PC. Probably the easiest way to get going</p>
            <a href="https://www.bsmanager.io/" class="installation-link" target="_blank" rel="noopener">
               <span>Download BSManager</span>
               <i class="fa fa-external-link-alt" />
            </a>
         </div>

         <div class="installation-card secondary">
            <div class="installation-icon pc">
               <i class="fa fa-download" />
            </div>
            <h3>PC (BeatMods)</h3>
            <p>Feeling brave? Download ScoreSaber from BeatMods and manually place it in your Beat Saber plugins folder</p>
            <a href="https://beatmods.com/mods/281" class="installation-link secondary" target="_blank" rel="noopener">
               <span>Download from BeatMods</span>
               <i class="fa fa-external-link-alt" />
            </a>
         </div>
      </div>
   </div>
</section>

<section class="info-section">
   <div class="info-container">
      <h2 class="info-section-title">Latest Ranked Batch</h2>
      <div class="video-card">
         <div class="video-header">
            <div class="video-icon">
               <i class="fab fa-youtube" />
            </div>
            <div class="video-title-section">
               <h3 class="video-title">{getBatchTitle(rankedBatch.month)}</h3>
            </div>
         </div>
         <div class="video-wrapper">
            <iframe
               width="100%"
               height="100%"
               src={getYouTubeEmbedUrl(rankedBatch.videoId)}
               title={getBatchTitle(rankedBatch.month)}
               frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen
            />
         </div>
      </div>
      <div class="reweights-section">
         <h3 class="reweights-title">Reweights</h3>
         <p class="reweights-description">
            With each monthly batch, maps get reweighted to correct their star ratings. All maps get reweighted once (a month after they're ranked),
            maps above 12 stars get reweighted again the next month, and maps above 14 stars get a third reweight the month after that. Sometimes
            there are global reweights that rebalance all maps.
         </p>
         <a href={getReweightsUrl(rankedBatch.month, rankedBatch.year)} class="reweights-link" target="_blank" rel="noopener">
            <span>{getReweightsLinkText(rankedBatch.month, rankedBatch.year)}</span>
            <i class="fa fa-external-link-alt" />
         </a>
      </div>
   </div>
</section>

<style>
   .hero-section {
      position: relative;
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      margin-bottom: 3rem;
   }

   .hero-banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      filter: brightness(0.4) blur(8px);
      -webkit-filter: brightness(0.4) blur(8px);
      transform: scale(1.1);
   }

   .hero-content {
      position: relative;
      z-index: 1;
      width: 100%;
      padding: 3rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .hero-text {
      text-align: center;
      max-width: 800px;
   }

   .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      letter-spacing: -0.01em;
      color: #fff;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
   }

   .hero-description {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 2.5rem 0;
      line-height: 1.6;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
   }

   .hero-stats {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
   }

   .stat {
      text-align: center;
   }

   .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--scoreSaberYellow);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      margin-bottom: 0.25rem;
   }

   .stat-label {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.8);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
   }

   .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
   }

   .cta-primary,
   .cta-secondary {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.9rem 1.75rem;
      border-radius: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      font-size: 1rem;
   }

   .cta-primary {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 166, 0, 0.95));
      color: #0c0c0f;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
   }

   .cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
      color: #0c0c0f;
   }

   .cta-secondary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
   }

   .cta-secondary:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--scoreSaberYellow);
      color: var(--scoreSaberYellow);
   }

   .info-section {
      padding: 4rem 1.5rem;
   }

   .info-container {
      max-width: 1200px;
      margin: 0 auto;
   }

   .info-section-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--textColor);
      text-align: center;
      margin: 0 0 1rem 0;
   }

   .info-section-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      text-align: center;
      margin: 0 0 3rem 0;
      line-height: 1.6;
   }

   .installation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
   }

   .installation-card {
      display: flex;
      flex-direction: column;
      padding: 2rem;
      background: var(--foreground);
      border: 1px solid var(--borderColor);
      border-radius: 0.9rem;
      text-align: center;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
   }

   .installation-card:hover {
      transform: translateY(-4px);
      border-color: var(--scoreSaberYellow);
      background: var(--foregroundItem);
   }

   .installation-card.secondary {
      opacity: 0.85;
      border-color: rgba(255, 255, 255, 0.1);
   }

   .installation-card.secondary:hover {
      opacity: 1;
      border-color: rgba(255, 215, 0, 0.4);
   }

   .installation-icon {
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.85rem;
      margin: 0 auto 1.25rem auto;
      font-size: 2rem;
   }

   .installation-icon.quest {
      background: rgba(0, 129, 251, 0.1);
      padding: 0.5rem;
   }

   .installation-icon.quest svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
   }

   .installation-icon.pc {
      background: rgba(255, 215, 0, 0.12);
      color: var(--scoreSaberYellow);
   }

   .installation-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--textColor);
      margin: 0 0 0.75rem 0;
   }

   .installation-card p {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
      flex: 1;
   }

   .installation-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      padding: 0.85rem 1.5rem;
      background: rgba(255, 215, 0, 0.15);
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: 0.75rem;
      color: var(--scoreSaberYellow);
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s ease, border-color 0.2s ease;
      margin-top: auto;
   }

   .installation-link:hover {
      background: rgba(255, 215, 0, 0.2);
      border-color: var(--scoreSaberYellow);
      color: var(--scoreSaberYellow);
   }

   .installation-link.secondary {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.7);
   }

   .installation-link.secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 215, 0, 0.5);
      color: var(--scoreSaberYellow);
   }

   .video-card {
      max-width: 900px;
      margin: 0 auto;
      background: var(--foreground);
      border: 1px solid var(--borderColor);
      border-radius: 0.9rem;
      overflow: hidden;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
   }

   .video-card:hover {
      transform: translateY(-2px);
      border-color: var(--scoreSaberYellow);
      box-shadow: 0 8px 24px rgba(255, 215, 0, 0.15);
   }

   .video-header {
      padding: 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
   }

   .video-icon {
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 0, 0, 0.1);
      border-radius: 0.85rem;
      color: #ff0000;
      font-size: 1.75rem;
      flex-shrink: 0;
   }

   .video-title-section {
      flex: 1;
   }

   .video-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--textColor);
      margin: 0;
   }

   .video-wrapper {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      background: #000;
   }

   .video-wrapper iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
   }

   .reweights-section {
      max-width: 900px;
      margin: 3rem auto 0;
      padding: 2rem;
      background: var(--foreground);
      border: 1px solid var(--borderColor);
      border-radius: 0.9rem;
      text-align: center;
   }

   .reweights-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--textColor);
      margin: 0 0 1rem 0;
   }

   .reweights-description {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
   }

   .reweights-link {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.85rem 1.5rem;
      background: rgba(255, 215, 0, 0.15);
      border: 1px solid rgba(255, 215, 0, 0.3);
      border-radius: 0.75rem;
      color: var(--scoreSaberYellow);
      text-decoration: none;
      font-weight: 600;
      transition: background 0.2s ease, border-color 0.2s ease;
   }

   .reweights-link:hover {
      background: rgba(255, 215, 0, 0.2);
      border-color: var(--scoreSaberYellow);
      color: var(--scoreSaberYellow);
   }

   @media (max-width: 768px) {
      .video-header {
         flex-direction: column;
         align-items: center;
         text-align: center;
         padding: 1.5rem;
      }

      .video-title {
         font-size: 1.5rem;
      }

      .hero-title {
         font-size: 2.5rem;
      }

      .hero-description {
         font-size: 1.1rem;
      }

      .hero-stats {
         gap: 2rem;
      }

      .stat-value {
         font-size: 2rem;
      }

      .hero-actions {
         flex-direction: column;
         width: 100%;
      }

      .cta-primary,
      .cta-secondary {
         width: 100%;
         justify-content: center;
      }
   }

   @media (max-width: 480px) {
      .hero-content {
         padding: 2rem 1rem;
      }

      .hero-title {
         font-size: 2rem;
      }

      .hero-description {
         font-size: 1rem;
      }

      .hero-stats {
         gap: 1.5rem;
      }

      .stat-value {
         font-size: 1.75rem;
      }

      .info-section-title {
         font-size: 2rem;
      }

      .info-section-subtitle {
         font-size: 1rem;
      }

      .installation-grid {
         grid-template-columns: 1fr;
      }

      .installation-card {
         padding: 1.5rem;
      }

      .video-header {
         padding: 1.25rem;
      }

      .video-title {
         font-size: 1.25rem;
      }

      .reweights-section {
         padding: 1.5rem;
         margin-top: 2rem;
      }

      .reweights-title {
         font-size: 1.25rem;
      }

      .reweights-description {
         font-size: 0.9rem;
      }
   }
</style>
