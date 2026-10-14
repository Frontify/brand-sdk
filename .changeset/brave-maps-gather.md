---
"@frontify/frontify-cli": patch
---

fix(deploy): honor `.gitignore` folder entries with a trailing slash and support project paths with glob characters

`deploy` no longer uploads folders that `.gitignore` lists with a trailing slash, such as `coverage/`. Projects in a folder whose path contains characters like `(`, `)`, `[` or `]` now deploy with correct file paths, and their `.gitignore` patterns apply. The CLI no longer depends on `fast-glob`, which removes the `braces` advisory (GHSA-vfj7-8cjw-p6xm) from `npm audit` in projects that install it.
