<script lang="ts">
   import Meta from '$lib/components/common/meta.svelte';
   import { defaultBackground } from '$lib/global-store';
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

<section class="section is-fullwidth no-padding">
   <div>
      <section class="hero is-custom is-banner is-bold" style="background-image: url('/images/banner.jpg');">
         <div class="hero-body" />
      </section>
   </div>
</section>
<div class="section breakout">
   <div class="window has-shadow">
      <h3>Welcome to ScoreSaber</h3>
      <p>
         ScoreSaber is Beat Saber's largest leaderboard system for custom songs, hosting 60 million scores across 170,000+ leaderboards, with more
         than 1 million users worldwide
      </p>
   </div>
</div>

<style>
   @media screen and (min-width: 769px), print {
      .hero.is-custom .hero-body {
         height: 20vw;
         min-height: 10rem;
         width: 100%;
         background-repeat: no-repeat;
      }
   }
   .hero.is-banner {
      background-image: url('../images/banner.jpg');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.21) !important;
   }
   .section.is-fullwidth.no-padding {
      padding-top: 0px;
      padding-bottom: 0px;
      padding-right: 0px;
      padding-left: 0px;
      width: 100vw;
      margin-left: 50%;
      transform: translateX(-50%);
   }
</style>
