---
"@frontify/guideline-blocks-settings": major
---

chore(deps): make `@frontify/fondue` a peer dependency

The package no longer installs its own copy of fondue; it uses the one your block depends on. Add fondue to your block if it isn't there yet:

```sh
pnpm add @frontify/fondue@^14.0.0-beta.2
```

The rich text editor props and plugins (`RichTextEditor`, `LinkPlugin`, `ButtonPlugin`, `AllTextStylePlugins`, …) use fondue's editor classes. With a single fondue copy, a `PluginComposer` you build from `@frontify/fondue/rte` type-checks against them; with two copies it didn't. If your block is on another fondue version, npm stops with an `ERESOLVE` error and pnpm reports an unmet peer instead of silently installing a second copy.
