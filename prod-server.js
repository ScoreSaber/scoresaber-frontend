const fs = require('fs');
const mustache = require('mustache');
const express = require('express');
const helmet = require('helmet');
const asyncHandler = require('express-async-handler');
const path = require('path');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({ target: 'http://localhost:4000' }));

app.use(helmet());
app.disable('x-powered-by');

const metaTemplate = `<meta property="og:image" content="{{{metaImage}}}" />
<meta property="og:image:secure_url" content="{{{metaImage}}}" />
<meta property="og:title" content="{{{metaTitle}}}" />
<meta property="og:description" content="{{{metaDescription}}}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{{{metaUrl}}}" />
<meta property="og:site_name" content="ScoreSaber" />`;

const htmlPath = path.join(__dirname + '/dist/production/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

app.get(
    '/',
    asyncHandler(async (req, res, next) => {
        var meta = {
            metaImage: 'https://new.scoresaber.com/android-chrome-512x512.png',
            metaTitle: 'ScoreSaber',
            metaDescription: "Beat Saber's largest leaderboard system for custom songs, earn PP from ranked maps, and compare scores with others.",
            metaUrl: 'https://new.scoresaber.com'
        };
        var metaTags = mustache.render(metaTemplate, meta);
        var output = html.replace('<replace dis="" boi="">', metaTags);
        res.send(output);
    })
);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/dist/production/')));

app.get('*', (req, res) => {
    res.send(html);
});

app.listen(Number(process.env.PORT || 5000));
