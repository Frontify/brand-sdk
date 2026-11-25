---
"@frontify/guideline-blocks-settings": major
---

chore(deps): bump `@frontify/fondue` to `14.0.0-beta.2`

The rich text editor props and plugins (`RichTextEditor`, `LinkPlugin`, `ButtonPlugin`, `AllTextStylePlugins`, …) are now typed against fondue 14. If your block builds a `PluginComposer` from its own `@frontify/fondue/rte`, upgrade it to `@frontify/fondue@14.0.0-beta.2` as well; on fondue 13 the plugins no longer type-check against these props.
