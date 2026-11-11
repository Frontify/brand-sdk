---
"@frontify/guideline-blocks-settings": major
---

chore: stop shipping fondue's deprecated CSS variables in `@frontify/guideline-blocks-settings/styles`

The stylesheet no longer defines fondue's deprecated `:root` variables, such as `--text-color`, `--line-color` and `--box-neutral-color`. The components in this package don't use them. If your own block CSS still reads them, switch to the current fondue tokens:

| Deprecated | Current |
| --- | --- |
| `--text-color` | `--color-primary-default` |
| `--text-color-weak` | `--color-secondary-default` |
| `--text-color-negative` | `--color-error-default` |
| `--base-color` | `--color-surface-default` |
| `--box-neutral-color` | `--color-container-secondary-default` |
| `--box-selected-color` | `--color-container-highlight-default` |
| `--line-color` | `--color-line-mid` |
| `--line-color-strong` | `--color-line-strong` |

fondue's `deprecatedBaseTokens.css` lists the mapping for every variable. Until you've migrated, you can import that file yourself:

```ts
import '@frontify/fondue/dist/packages/tokens/legacy/deprecatedBaseTokens.css';
```
