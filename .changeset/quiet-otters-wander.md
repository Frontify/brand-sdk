---
"@frontify/frontify-cli": patch
---

chore(templates): remove Fondue from the platform app templates and move the Tailwind template to Tailwind v4

Apps created with `frontify-cli create` from a platform app template no longer depend on `@frontify/fondue`, and no longer need the `@udecode/plate-common` and `zustand` overrides. The Tailwind template now uses Tailwind CSS v4 through `@tailwindcss/postcss`, without `autoprefixer` or a `tailwind.config.ts`. A fresh install of any platform app template now reports no `npm audit` vulnerabilities. The templates no longer load Fondue's tokens, base styles and fonts, and the Tailwind template uses the default Tailwind theme.
