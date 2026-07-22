---
"@frontify/frontify-cli": patch
---

fix(deploy): skip eslint checks when no eslint config is present

The deploy command previously failed when a project had no ESLint config file. It now detects a missing config and skips the ESLint step, so projects that lint with another tool (e.g. oxlint) can deploy. Run your  linter manually before deploying if you don't use ESLint.
