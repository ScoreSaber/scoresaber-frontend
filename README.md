## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), create a new `.env` file using the template from `.env.example` CORS is currently enabled for both the CDN and the API so your `.env` should look a little like this until we find a better solution in the future

```
VITE_CDN_URL=https://cdn.scoresaber.com
VITE_API_URL=https://novus.scoresaber.com
```

To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building
```bash
npm run build
```

> You can preview the built app with `npm run preview`. This should _not_ be used to serve ScoreSaber in production.
