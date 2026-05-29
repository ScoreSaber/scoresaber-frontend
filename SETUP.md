# Setup

## Before Getting Started

While we do our best & pin dependencies to mitigate these problems, modern js development means installing packages from [npm](https://www.npmjs.com/); and frankly Microsofts security standards as of late have been appalling. Supply chain attacks are becoming common enough that you should protect your machine before installing dependencies in any project, including ours

If you haven't already, we strongly urge y'all to harden your shell environment before going forward; it's not difficult, just follow [this](https://gist.github.com/Umbranoxio/84bb7f284ce8250108274f54dafef98b)

## Requirements

### Package Manager

Install Bun:

Linux and macOS:

```sh
curl -fsSL https://bun.sh/install | bash
```

Windows:

```sh
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Runtime

Use Node `24.x`

We recommend [nvm](https://github.com/nvm-sh/nvm#installing-and-updating). From the project root:

```sh
nvm install
nvm use
```

## Environment

Create `.env.local`:

```sh
cp .env.example .env.local
```

The expected contributor env is:

```sh
API_URL=https://scoresaber.com
NEXT_PUBLIC_API_URL=https://scoresaber.com
NEXT_PUBLIC_SITE_URL=https://scoresaber.local
NEXT_PUBLIC_ARCVIEWER_URL=https://watch.scoresaber.com
```

This keeps the website local while using production API and replay viewer services

> Sidenote; if you're at all curious about the duplcicated API url. In prod `API_URL` points to a local url & is used over `NEXT_PUBLIC_API_URL` for s2s communication. `NEXT_PUBLIC_API_URL` is still required for client sided mutations

## Run The Website

Install dependencies:

```sh
bun i
```

Start the dev server:

```sh
bun run dev
```

Open `https://scoresaber.local`

The dev script uses [portless](https://portless.sh/) to serve the app on the named local domain.

## IDE Setup

This project includes recommended VS Code extensions in `.vscode/extensions.json` and workspace settings in `.vscode/settings.json`

Install the recommendations when prompted or manually

- [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) - linting & formatting
- [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)

You can also install them quickly inside vscode by following these steps:

- `cmd` or `ctrl` + `shift` + `p` to open the command pallette
- type `show recc`
- select `Extensions: Show Recommended Extensions`
- you should now see all recommended extensions for the project & be able to install them

## Checks

IDE extensions and pre-commit hooks should handle most formatting and linting for you. If you want to run the same checks manually:

```sh
bun run lint
bun run format:check
```

For behavior, routing, data fetching, config, dependency, or API client changes, a production build is also useful:

```sh
bun run build
```

And as for tests, while we have plenty in our backend services we don't really see the need for them on the frontend. Feel free to prove us wrong though!

## API Client

Generated API files live in `src/shared/api/generated`. Do not edit them directly.

Regenerate from the checked-in OpenAPI file:

```sh
bun run api:generate
```

If you are also running the local platform API, fetch its OpenAPI JSON and regenerate:

```sh
bun run api:regen
```

For `api:regen`, start the API from the platform repo first:

```sh
bun run api:dev
```

Then point `.env.local` at the local API:

```sh
API_URL=https://api.scoresaber.local
NEXT_PUBLIC_API_URL=https://api.scoresaber.local
```

## Production Build

Build and run the production server locally:

```sh
bun run build
bun run start
```

`bun run start` serves on port `4000`.
