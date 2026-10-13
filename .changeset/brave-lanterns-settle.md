---
"@frontify/frontify-cli": patch
---

chore(templates): update the platform app templates to current tooling

Apps created with `frontify-cli create` from a platform app template now install without the peer dependency conflict and the ESLint and install-script warnings. They ship with Fondue 14 (beta), ESLint 10, TypeScript 6 and `@frontify/app-bridge-app` 0.3. The `typecheck` script, and the type check that `deploy` runs, now check the files in `src`; before this change they checked nothing.
