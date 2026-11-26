---
name: public-api
description: Guards the published API of the `@frontify/*` packages. ALWAYS apply when removing, renaming, deprecating or narrowing anything a package exports — a function, hook, component, prop, type, enum member, setting type, registry key, entry point or CLI flag — even if the user only says "clean up", "drop the old X", "retire" or "make this internal", and when planning a breaking change or a major version. Do not delete or rename an export directly — apply this skill first. Skip for adding new exports and for changes to symbols no package entry exports.
---

Every package here is published to npm and used outside this repository. A removal that typechecks here can still break a consumer, so check the consumers before you change the API.

## Steps

1. Confirm the symbol is public. It is public when a package entry reaches it: `src/index.ts` of the package, a subpath in the `exports` of its `package.json` (for example `@frontify/app-bridge/testing`), or a re-export from another package. `@frontify/guideline-blocks-settings` re-exports all of `@frontify/sidebar-settings`, so a change there is also a change to `guideline-blocks-settings`. For `@frontify/frontify-cli`, the public surface is the commands, flags, prompts, output and the files in `templates/`.

2. Check which release line you are on. `main` is the current line, `app-bridge-v3` only receives security fixes for the 3.x versions. A removal belongs on `main` and ships with the next major version; never remove an export on `app-bridge-v3`. An API may already be gone or renamed on the other line.

3. Search the two in-house consumers on their default branch, not on a local feature branch:
    - [`Frontify/guideline-blocks`](https://github.com/Frontify/guideline-blocks) holds the blocks Frontify ships: `gh search code --repo Frontify/guideline-blocks "<symbol>"`, or `git grep -n "<symbol>" origin/HEAD` in a local checkout after `git fetch`.
    - The Frontify web app is a private repository. It re-exports `@frontify/app-bridge` as a whole and implements the host side of the registries, so it can use every export and it handles every `CommandRegistry` and `ApiMethodRegistry` key. Search a local checkout the same way if you have one. If you do not have access, say so and ask the user to run the search. Do not guess.

4. Decide between deprecating and removing.
    - Deprecate first when the change is not on a major version: keep the export working, add a `@deprecated` JSDoc tag that names the replacement (`@deprecated Use \`appBridge.context('blockId').get()\` instead.`), and remove it in the next major version.
    - Remove only in a major version, and only when no consumer uses it or every use has a migration.

5. Move what the web app still needs. An export that only the web app uses is moved into the web app before it is removed here. List it as a prerequisite and do not remove it in the same step.

6. Make the change, then follow the references: the package entry and its barrel files, the test stubs and dummies in `src/tests/` that mirror the API, `CODEOWNERS` lines for deleted `packages/app-bridge` files, and the templates in `packages/cli/templates/` that use the API.

7. Write the changeset with the `create-changeset` skill: `major` for a removal, a rename or a narrowed type, `patch` or `minor` for a deprecation. Say what the consumer has to change, with a before and after example for a rename.

8. Report the result: the call sites found in each consumer (or that there are none), what has to be moved into the web app first, and any consumer you could not search. Put the same list in the pull request description, without paths from the private repository.
