# Frontify Brand SDK — Agent Guidelines

## Checks

See the `package.json` of each package for all scripts. Run checks for the package you touched, never for the whole workspace.

- Tests: `pnpm --filter <package> exec vitest run <path/to/file.spec.ts>` — always specify a file. Never use watch mode.
- Lint: `pnpm --filter <package> exec oxlint --type-aware <path/to/file.ts>` — always specify the touched files.
- Type check: `pnpm --filter <package> typecheck`
- Format: `pnpm --filter <package> exec oxfmt <path/to/file.ts>`

`<package>` is the npm name, for example `@frontify/app-bridge`, and paths are relative to the package directory. Packages resolve each other through the built `dist/`: if a sibling `@frontify/*` import does not resolve, or a change in one package is not visible in another, run `pnpm build:<directory>` (for example `pnpm build:app-bridge`) first.

## Codebase layout

A pnpm monorepo (Node 24, pnpm only) of the npm packages that Frontify content blocks, themes and platform apps are built with. Every package is published, so every exported symbol, type, prop and CLI flag is public API.

- **`packages/app-bridge`** (`@frontify/app-bridge`) is the bridge between a block and the Frontify host: the `AppBridgeBlock` interface, the API method, command and event registries in `src/registries/`, React hooks in `src/react/`, and test stubs and dummies in `src/tests/`, published as `@frontify/app-bridge/testing`.
- **`packages/app-bridge-theme`** and **`packages/app-bridge-app`** are the bridges for themes and for platform apps.
- **`packages/sidebar-settings`** holds the setting types and validation rules shared by blocks, themes and apps.
- **`packages/guideline-blocks-settings`**, **`packages/guideline-themes`** and **`packages/platform-app`** hold the settings definitions and helpers for each app type. `guideline-blocks-settings` re-exports all of `sidebar-settings` and ships the shared block components.
- **`packages/cli`** (`@frontify/frontify-cli`) is the `frontify-cli` binary and the app templates in `templates/`. It has no importable API.

Stack: React 18, TypeScript, Vite, Vitest (happy-dom), oxlint, oxfmt, Tailwind 3, Fondue, changesets.

## Release lines

- `main` is the current line and publishes under the `latest` tag. `app-bridge-v3` is the maintenance line for the 3.x versions of `@frontify/app-bridge` and `@frontify/guideline-blocks-settings`: it only receives security fixes and publishes under the `legacy-v3` tag. The two differ substantially, so check which line you are on before you assume an API exists.
- A push to either line runs the changesets action. It opens the `chore: release packages` pull request and publishes to npm when that is merged.

## Skills

Skills live in `.agents/skills/` (`.claude/skills` is a symlink to it). They trigger on subject, not phase: a plan, spec, or review counts the same as coding. Load a skill before designing, not after.

## When a check blocks you

Checks are proxies for intent — never make one pass while its intent stays violated. Test: would the change be justified if the check didn't exist? Disable comments, `any`/`unknown` casts, deleting or loosening tests, and editing checker configs are evasion, not fixes. Fix the cause or stop and report the blocking rule; blocked is acceptable, laundered green is not.

## Always-on rules

Rules the tooling already enforces (copyright header, import order, formatting, pull request title format) are omitted — the linter and CI catch those; these are the ones they do not:

- This repository is public. Keep internal hostnames, private repository paths and customer data out of code, comments, changesets and pull requests.
- Never commit on `main` or `app-bridge-v3`. Work on a branch and open a pull request against the line the change belongs to.
- Never edit a `CHANGELOG.md` or a package `version` by hand, and never run `changeset version` or `changeset publish`. The release pull request does both.
- A change that consumers of a published package can observe needs a changeset. Changes to CI, repository tooling or root docs need none.
- Start every `test(...)` and `it(...)` description with `should`. Fix the names of existing tests in a file when you touch it.
- Treat every export as public API. Do not remove, rename or narrow one without the consumer check in the `public-api` skill.
- Mark an API that is going away with a `@deprecated` JSDoc tag that names the replacement, and keep it working until the next major version.
