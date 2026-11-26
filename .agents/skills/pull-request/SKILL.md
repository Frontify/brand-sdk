---
name: pull-request
description: Create a pull request in the Brand SDK repository. ALWAYS apply when the user asks to "open a PR", "create a pull request", "make a PR" or "ship this". Skip for committing or pushing without a PR, reviewing existing PRs, or updating a PR's code.
---

1. Pick the base. `main` is the current line and `app-bridge-v3` is the maintenance line for security fixes to the 3.x versions. The base is the line your branch was cut from: after `git fetch`, compare `git rev-list --count origin/main..HEAD` with `git rev-list --count origin/app-bridge-v3..HEAD`. The base is the line with the smaller count. Ask if it is unclear. Never open a pull request from one line into the other.

2. Gather context in parallel: `git status`, `git diff <base>...HEAD`, `git log <base>..HEAD`.

3. Check for a changeset. If the diff changes what consumers of a published package can observe and `.changeset/` has no new file for it, write one with the `create-changeset` skill first. CI, repository tooling and root docs need none.

4. If you are on `main` or `app-bridge-v3`, create a branch first: `<type>/<slug>` (`fix/link-modal-position`).

5. Commit with a Conventional Commits message.

6. Write the title as `<type>(<scope>): <summary> [TICKET-ID]`, under about 70 characters. A workflow rejects a title that is not Conventional Commits.
    - Lowercase `<type>`, one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Add `!` for a breaking change (`chore(deps)!: …`).
    - An optional scope that names the hook, component or area with its casing in the code (`fix(RichTextEditor):`, `chore(useReadyForPrint):`, `chore(deps):`).
    - A summary in lowercase imperative. Drop `[TICKET-ID]` if there is no ticket.

7. Write a brief body in plain language for a teammate. Scale it to the diff: a one-line change gets a one-line description.
    - What changed for consumers of the packages, and why. No file lists and no code walkthrough.
    - How it was verified.
    - For a removed, renamed or deprecated export: the consumer call sites found with the `public-api` skill.
    - For a new registry entry: that the host handler has to exist before blocks can use it.

    The repository is public. Leave out internal hostnames, paths from private repositories and customer names.

8. Push if needed, then create it: `gh pr create --base <base> --title "..." --body "..."`. Always pass `--base`, since the default is `main` and a branch cut from `app-bridge-v3` would otherwise target the wrong line.

9. Return the PR URL.
