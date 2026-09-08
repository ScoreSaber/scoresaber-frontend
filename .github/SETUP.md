# Setup

## Before Getting Started

While we do our best and pin dependencies to mitigate these problems, modern JS development means installing packages from [npm](https://www.npmjs.com/). Supply chain attacks are common enough that you should protect your machine before installing dependencies in any project, including ours

If you haven't already, we strongly urge y'all to harden your shell environment before going forward. It's not difficult, just follow [this](https://gist.github.com/Umbranoxio/84bb7f284ce8250108274f54dafef98b)

## Requirements

### Vite+

Install the Vite+ CLI, which provisions the Node and pnpm versions pinned by this project:

Linux and macOS:

```sh
curl -fsSL https://vite.plus | bash
```

Windows:

```sh
powershell -c "irm https://vite.plus/ps1 | iex"
```

If you already have the pnpm version pinned in `package.json`, Vite+ doesn’t need to be installed globally:

```sh
pnpm install
pnpm exec vp dev
```

`pnpm install` installs the project-local Vite+ CLI. The global CLI is recommended because it also manages the pinned Node and pnpm versions

## Environment

Create `.env` only when overriding the local defaults:

```sh
cp .env.example.local .env
```

By default, the website runs locally while using production API and replay viewer services:

```sh
API_URL=https://scoresaber.com
NEXT_PUBLIC_API_URL=https://scoresaber.com
NEXT_PUBLIC_SITE_URL=https://scoresaber.local
NEXT_PUBLIC_ARCVIEWER_URL=https://watch.scoresaber.com
```

This keeps the website local while using production API and replay viewer services

> Sidenote; if you're at all curious about the duplicated API URL. In production `API_URL` points to a local URL and is used over `NEXT_PUBLIC_API_URL` for server-to-server communication. `NEXT_PUBLIC_API_URL` is still required for client-side mutations

## Run The Website

Install dependencies:

```sh
vp install
```

Start the dev server:

```sh
vp dev
```

Open the local URL printed by Vite+

When launched from the Platform checkout with `vp run website:dev`, Portless serves the website at `https://scoresaber.local`

## IDE Setup

This project includes recommended VS Code extensions in `.vscode/extensions.json` and workspace settings in `.vscode/settings.json`

Install the recommendations when prompted or manually

- [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) - linting and formatting
- [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

You can also install them quickly inside VS Code:

- Open the command palette with `cmd` or `ctrl` + `shift` + `p`
- Select `Extensions: Show Recommended Extensions`

## Checks

Run formatting, linting and type-checking with:

```sh
vp check
```

Run the complete validation suite with:

```sh
vp run verify
```

The full verification also checks the generated API client and production website build

## API Client

Generated API files live in `src/shared/api/generated`. Do not edit them directly

Regenerate from the checked-in OpenAPI file:

```sh
vp run api:generate
```

If you are also running the local Platform API, fetch its OpenAPI JSON and regenerate:

```sh
vp run api:regen
```

Start the API from the Platform repo first:

```sh
vp run api:dev
```

Then point `.env` at the local API:

```sh
API_URL=https://api.scoresaber.local
NEXT_PUBLIC_API_URL=https://api.scoresaber.local
```

## Production Build

Build and run the production server locally:

```sh
vp build
vp run start
```

`vp run start` serves on port `4000`
