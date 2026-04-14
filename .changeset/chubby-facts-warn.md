---
"@frontify/frontify-cli": patch
---

fix: resolve all ESLint warnings across the CLI package

- Add typed interfaces (`LoginOptions`, `ServeOptions`, `DeployOptions`) for CLI action callbacks to eliminate unsafe `any` access on command options
- Cast `prompts()` return values to proper types instead of implicit `any` destructuring
- Handle floating promises in `login.ts` and `platformAppDevelopmentServer.ts` with `.catch()` instead of fire-and-forget
- Replace `@ts-expect-error` workarounds in `promiseExec.ts` with proper `String()` coercion
- Refactor `reactiveJson.ts` to use typed `JSON.parse`, `Record`-based proxy handler, and `instanceof`/`in` checks instead of `as any` casts
- Replace `as any` casts in `vitePlugins.ts` with `Record<string, unknown>` for rolldownOptions access
- Add local `Archive` interface in `zip.ts` to properly type the untyped `archiver` module
- Use `keyof typeof` cast in `gitignoreTemplate.ts` for safe object indexing
- Type dynamic `import()` results and `JSON.parse` calls in test files
- Remove unused `eslint-disable` directives
