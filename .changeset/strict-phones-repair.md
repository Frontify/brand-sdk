---
"@frontify/frontify-cli": patch
---

chore(cli): bump content-block template dev toolchain

- `eslint` 8 → 10 (flat config); `@frontify/eslint-config-react` 0.17 → 1.0.15
- `typescript` 5 → 6
- `tailwindcss` 3.4.3 → 3.4.17, `autoprefixer` 10.4.22 → 10.4.27, explicit `postcss` dep (tailwind template)
- Replace deprecated `tailwindcss/tailwind.css` side-effect import with a local `src/style.css` using `@tailwind` directives
- Pin `@frontify/guideline-blocks-settings` to exact `2.1.8`
- Migrate `.eslintrc.cjs` → `eslint.config.mjs` (flat config)
