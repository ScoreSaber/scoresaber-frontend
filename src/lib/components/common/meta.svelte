<script lang="ts">
   import { page } from '$app/stores';

   export let image = 'https://scoresaber.com/512x512.png';
   export let title = 'ScoreSaber';
   export let description = "Beat Saber's largest leaderboard system for custom songs, earn PP from ranked maps, and compare scores with others.";
   export let url: string | undefined = undefined;
   export let type = 'website';

   const scoreSaberYellow = '#ffde1a';
   const siteUrl = 'https://scoresaber.com';

   $: fullUrl = url ?? `${siteUrl}${$page.url.pathname}${$page.url.search}`;
</script>

<!-- Primary Meta Tags -->
<meta name="title" content={title} />
<meta name="description" content={description} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={fullUrl} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:image:secure_url" content={image} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="ScoreSaber" />
<meta property="og:locale" content="en_US" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content={fullUrl} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={image} />
<meta name="twitter:site" content="@ScoreSaber" />

<!-- Theme Color (for Discord, mobile browsers, etc.) -->
<meta name="theme-color" content={scoreSaberYellow} />
<meta name="msapplication-TileColor" content={scoreSaberYellow} />
