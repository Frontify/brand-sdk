---
name: create-changeset
description: Use this skill whenever the user asks to create a changeset, changelog entry, or `.changeset/*.md` file in this repo. Produces a `@changesets/cli`-style file (random three-word slug filename) with a Conventional Commits–prefixed body, scoped to the affected workspace package(s), and includes usage examples when the change adds a new feature or public API.
---

# Create a changeset

Use this skill to author a `.changeset/<slug>.md` file for a pending change in `brand-sdk`. Do **not** run `pnpm changeset` interactively — write the file directly.

## 1. Pick the filename

Use a random three-word slug in the `human-id` style that `@changesets/cli` itself generates: `adjective-plural-noun-verb`.

- Examples from this repo: `quiet-flyouts-simplify`, `silver-panthers-march`, `swift-koalas-hum`, `six-spies-occur`, `silly-trees-vanish`.
- **Never** use a descriptive filename like `bump-fondue-13-4-5.md`, `fix-typo.md`, or `add-feature.md`. The descriptive content goes inside the body, not the filename.
- Before writing, check `.changeset/` to make sure the slug is not already taken; if it is, pick another.

Final path: `.changeset/<adjective>-<plural-noun>-<verb>.md`.

## 2. Pick the affected packages and bump levels

Inspect the staged/unstaged diff (`git status`, `git diff`) to determine which workspace packages under `packages/*` were modified, and list each one with a semver bump:

- `patch` — bug fix, refactor, internal cleanup, dep bump, docs, tests.
- `minor` — new feature or new public API, backwards-compatible.
- `major` — breaking change to a public API.

Workspaces (use the `name` field from each `packages/*/package.json`, e.g. `@frontify/guideline-blocks-settings`, `@frontify/app-bridge`, `@frontify/sidebar-settings`, `@frontify/cli`, `@frontify/guideline-themes`, `@frontify/app-bridge-theme`, `@frontify/app-bridge-app`, `@frontify/platform-app`).

**When to skip a changeset entirely** — if the change only touches:

- CI configuration (`.github/workflows/**`, etc.)
- Repo-root devDeps or tooling that no published package consumes
- Repo-level docs (root `README.md`, contributing guides)

…then a changeset is most likely not needed. Surface this to the user before writing one: *"This looks CI-/tooling-only and probably doesn't need a changeset — want me to skip it?"* Only proceed if they confirm.

## 3. Write for consumers, not contributors

A changeset becomes a CHANGELOG entry that someone reading the diff in their `pnpm install` output will see. Describe **only what's observable to consumers** of the package — not what was rearranged inside the source tree. The reader's question is *"what changed for me when I install this version?"*, not *"what did the author do this week?"*.

What counts as consumer-visible depends on the package shape:

- **Library packages** (`@frontify/app-bridge`, `@frontify/guideline-blocks-settings`, `@frontify/sidebar-settings`, `@frontify/app-bridge-theme`, `@frontify/app-bridge-app`, …) — exported APIs, types, props, hooks, components, runtime behavior, peer-dep changes.
- **Binary packages** (`@frontify/frontify-cli`, anything with only `bin` and no `main`/`exports`) — commands, flags, prompts, generated output / response shapes, exit codes, error messages.

**Always exclude from the body** (these belong in the commit message or PR description, not the CHANGELOG):

- Internal renames of non-exported symbols, file moves, folder restructures.
- Type-only refactors that don't change a published type (e.g. tightening an internal union, replacing a cast, splitting/combining internal types).
- Test additions, fixture updates, lint/format fixes.
- Implementation details ("now uses a discriminated union", "removed a cast", "wired through a different helper").

If a change is genuinely internal-only and you're still writing a `patch` changeset to trigger a release, keep the body to **one short imperative line** (`refactor: clean up internal manifest typing`) — don't pad it with mechanics. If you can't think of anything consumer-facing to write, that's a signal the change might not need a changeset at all; ask the user before proceeding.

## 4. Write the body using Conventional Commits

The body **must** start with a Conventional Commits type prefix. Choose the one that matches the change:

| Prefix | Use for |
| --- | --- |
| `feat:` | New feature or new public API |
| `fix:` | Bug fix |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `chore:` | Tooling, build, deps, internal housekeeping (e.g. `chore(deps):`) |
| `docs:` | Documentation only |
| `test:` | Adding or updating tests |
| `perf:` | Performance improvement |
| `style:` | Formatting / whitespace, no logic change |
| `build:` | Build system or external deps that affect a published package |
| `ci:` | CI configuration (rarely needs a changeset — see "When to skip" above) |

Optional scope in parentheses — but **never use the workspace package name as the scope**. The package is already declared in the frontmatter, so `feat(guideline-blocks-settings): …`, `fix(app-bridge): …`, etc. are redundant and should not be written.

Use a scope only when it points at something *more specific* than the package — a feature area, hook, component, or subsystem inside that package. Good: `chore(deps): …`, `refactor(useBlockAssets): …`, `feat(AttachmentsToolbarButton): …`. If you can't think of a meaningful sub-scope, omit the parentheses entirely: `feat: …`, `fix: …`.

Keep the summary line tight and imperative. If the change is non-trivial, follow with one or two short sentences of context (the *why*, or what the user-visible effect is) — staying within the consumer-visible boundary defined in §3.

## 5. Add examples when the change is new

If the change is `feat:` (or any change that introduces a new prop, hook, component, setting, CLI flag, exported helper, etc.), include a short fenced code block showing how to use the new thing. Examples are **not** required for `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`, `perf:`, `build:`, `ci:` — only when there is a new surface a consumer can call.

The example should be minimal and copy-pasteable, and should match the package shape:

- **Library packages** — `import` statement plus the smallest call site that demonstrates the feature.
- **Binary packages** — the command invocation, or the relevant slice of generated output / response shape that the new feature produces.

## 6. Final file shape

```markdown
---
"@frontify/<package-name>": <patch|minor|major>
---

<type>(<optional-scope>): <imperative summary>

<optional 1–2 sentence context>

<optional ```ts code example — required when introducing a new public API>
```

### Reference: existing examples in this repo

- Patch / refactor (no code example): `.changeset/quiet-flyouts-simplify.md`
- Patch / dep bump: prior `chore(deps): bump \`@frontify/fondue\` to \`^13.4.3\`` style
- Minor / new feature with code example: look at any historical changeset under `feat(...)` for shape

## Checklist before finishing

- [ ] Filename is a fresh `adjective-noun-verb` slug, not descriptive, not colliding with an existing file.
- [ ] Frontmatter lists every affected `@frontify/*` package with the correct bump level.
- [ ] Body starts with a Conventional Commits prefix.
- [ ] Scope (if any) is **not** a workspace package name — that's already in the frontmatter.
- [ ] Body describes only consumer-visible effects (per §3) — no internal renames, type-only refactors, casts, file moves, or implementation details.
- [ ] If the change is internal-only, the body is a single imperative line — not padded with mechanics.
- [ ] If `feat:` or otherwise introduces a new API, a usage example is included.
- [ ] Did not run `pnpm changeset` interactively — wrote the file directly with the Write tool.
