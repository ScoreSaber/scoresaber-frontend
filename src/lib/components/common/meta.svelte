<script lang="ts">
   export let image = 'https://novus.scoresaber.com/512x512.png';
   export let title = 'ScoreSaber';
   export let description = 'ScoreSaber';
   export let url = 'https://scoresaber.com';

   const descriptionTag = `<meta property="og:description" content="${description}" />`;
</script>

<meta property="og:image" content={image} />
<meta property="og:image:secure_url" content={title} />
<meta property="og:title" content={title} />
{@html descriptionTag}
<meta property="og:type" content="website" />
<meta property="og:url" content={url} />
<meta property="og:site_name" content="ScoreSaber" />
