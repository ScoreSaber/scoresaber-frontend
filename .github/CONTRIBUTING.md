# Contributing

The website is a standalone frontend. Most contributions can be done against production ScoreSaber services without running the full platform stack

For local setup, start with [SETUP.md](SETUP.md)

## Package Management

Use Vite+ for package work. It manages the pinned pnpm version for the project:

```sh
vp install
vp add <package>
vp remove <package>
```

Direct pnpm also works without a global Vite+ install. Use the version pinned in `package.json`, run `pnpm install`, then invoke built-in Vite+ commands through `pnpm exec vp`. Do not use npm, Bun or yarn to install dependencies

## Code Style

- kebab-case for TypeScript filenames and directories
- Use named exports
- Omit explicit TypeScript return types when inference is clear
- Keep explicit return types when they make a public contract clearer or inference is weak
- Use runtime validation instead of casts when dealing with unknown strings or request data

## React & UI

- Use the existing shadcn/ui components in `src/components/ui` before creating raw controls
- Add `cursor-pointer` to interactive shadcn controls where the primitive does not already provide it
- Use semantic design tokens and helpers instead of hardcoded colors
- Put user facing text in `messages` and read it with `useTranslations` or `getTranslations`

## Data, Routing & Errors

- Routes live in `src/routes` and export `Route` from the route file. Add route params and search validation in the route config with Zod
- Use route links, generated route APIs, or existing URL helpers for internal navigation. Do not manually assemble URLs when typed route helpers are available
- Fetch route page data from route loaders and server functions with the server API client
- Client components use TanStack Query for async API work
- Do NOT use raw `useEffect` plus `fetch` for client API state
- Use shared API wrappers instead of raw `try`/`catch`:
   - `pageApiData` for route loaders that render inline page errors
   - `optionalApi` or `optionalApiData` when missing or failed data can be treated as `null`
   - `requiredApiData` when a failed required resource should throw
   - `queryApiData` in TanStack Query functions that should reject on API errors
   - `apiResult` when the caller needs to branch on the full result
   - `actionApiData`, `actionApiVoid`, `actionResult`, or `actionResultVoid` inside server actions
- No raw `try`/`catch` unless absolutely necessary. Use [better-result](https://better-result.dev/introduction) helpers for fallible work
- Server actions return `ActionResult`. Use `unwrapAction` inside mutation functions and `result.ok` checks outside mutations

## API Client

`src/shared/api/generated/ApiParams.ts` is the source of truth for generated API types

Do not manually edit generated client files. After API contract changes, regenerate the client:

```sh
vp run api:generate
```

Use `vp run api:regen` only when the local API is running and you need to fetch a fresh OpenAPI spec

## Checks

Run the full check before committing:

```sh
vp run verify
```

## Commits

Our commit style is `{feature}: {change_summary} (#{issue_number})` <sub>(sometimes maintainers are naughty and bypass the need for an issue number, do not be like the maintainers)</sub>

Example:

```text
rank-request: fix comment wrapping (#55)
denyah: destroy the page some more (#1)
```
