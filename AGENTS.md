# AGENTS.md — working in the Brand SDK

The single source of truth for agents and humans working in this repository (`CLAUDE.md` is a symlink to it).
This repository is public: keep internal hostnames, private repository paths and customer data out of code,
comments, changesets and pull requests.

Brand SDK is a pnpm monorepo of the npm packages that Frontify apps (content blocks, themes, platform apps) are
built with. Every package under `packages/` is published to npm, so any exported symbol, type, prop or CLI flag
is public API.

## Packages

| Directory                            | npm name                              | What it is                                             |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------ |
| `packages/app-bridge`                | `@frontify/app-bridge`                | Bridge between a block and the Frontify host           |
| `packages/app-bridge-theme`          | `@frontify/app-bridge-theme`          | Bridge for themes                                      |
| `packages/app-bridge-app`            | `@frontify/app-bridge-app`            | Bridge for platform apps                               |
| `packages/sidebar-settings`          | `@frontify/sidebar-settings`          | Setting types and rules shared by blocks, themes, apps |
| `packages/guideline-blocks-settings` | `@frontify/guideline-blocks-settings` | Block settings and shared block components             |
| `packages/guideline-themes`          | `@frontify/guideline-themes`          | Theme settings and helpers                             |
| `packages/platform-app`              | `@frontify/platform-app`              | Platform app settings and helpers                      |
| `packages/cli`                       | `@frontify/frontify-cli`              | The `frontify-cli` binary (no importable API)          |

`guideline-blocks-settings` re-exports all of `@frontify/sidebar-settings`, so a change to `sidebar-settings`
exports is also a change to the public API of `guideline-blocks-settings`.

## Branches and releases

- `main` is the stable line. `dev` is the prerelease line (`.changeset/pre.json`, published under the `alpha`
  tag) and carries the next major versions. The two differ substantially; check which one you are on before
  assuming an API exists.
- Never commit directly on `main` or `dev`. Work on a branch and open a pull request against the line the change
  belongs to.
- Pull request titles must be Conventional Commits (`feat: …`, `fix(useBlockAssets): …`); a workflow checks it.
- A push to either line runs the changesets action, which opens the `chore: release packages` pull request and
  publishes to npm when that is merged. Never edit a `CHANGELOG.md` or a package `version` by hand.

## Commands

Node 24 (`.nvmrc`) and pnpm only. Run checks for the package you touched, not the whole workspace:

```sh
pnpm --filter @frontify/app-bridge test                           # all specs of one package
pnpm --filter @frontify/app-bridge exec vitest run src/react/useBlockAssets.spec.ts
pnpm --filter @frontify/app-bridge typecheck
pnpm --filter @frontify/app-bridge lint                           # oxlint, type-aware
pnpm --filter @frontify/app-bridge format                         # oxfmt
```

Packages resolve their workspace dependencies through the built `dist/`. If a sibling `@frontify/*` import does
not resolve, or a change in one package is not visible in another, run `pnpm build` (or `pnpm build:<package>`)
first. CI does the same: it builds everything before linting, typechecking and testing.

## Conventions

- **Test names start with "should"**: `test('should return X when Y', …)`, never `test('returns X when Y', …)`.
  Fix the names of existing tests in a file when you touch it.
- Specs sit next to the source as `*.spec.ts(x)`. The exceptions are `packages/cli` and
  `packages/sidebar-settings`, which keep them in `tests/`.
- Every source file starts with `/* (c) Copyright Frontify Ltd., all rights reserved. */` followed by an empty
  line. The linter enforces it.
- `CODEOWNERS` lists `packages/app-bridge` file by file. Add a line when you add a file there.

## Changesets

A change that consumers of a published package can observe needs a changeset. Follow
`.claude/skills/create-changeset/SKILL.md`: a random three-word filename, a Conventional Commits body that
describes only what consumers observe, and no package name as scope. Changes to CI, repository tooling or root
docs need none.

## Removing or changing public API

Exports of these packages are used outside this repository, so a removal that typechecks here can still break a
consumer.

- The Frontify web app (private repository) re-exports `@frontify/app-bridge` as a whole and implements the
  command registry, so it uses every export and every `CommandRegistry` key.
- [`frontify/guideline-blocks`](https://github.com/Frontify/guideline-blocks) holds the blocks Frontify ships.

Before you remove or rename an export, search both for usages on their default branch (not on a local feature
branch) and list the call sites in the pull request description. Anything the web app still uses has to be
moved into the web app before it is removed here. Mark the change as breaking (`feat!:` / `major` changeset).
