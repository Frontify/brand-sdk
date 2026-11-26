# Block Settings

Provides the block settings types, helpers and React components for building guideline blocks.

## Installation

Install the package together with its peer dependencies:

```sh
pnpm add @frontify/guideline-blocks-settings @frontify/app-bridge @frontify/fondue react react-dom
```

Your block provides `@frontify/app-bridge`, `@frontify/fondue`, `react` and `react-dom`, and this package uses those same copies. Their versions need to match the package's `peerDependencies`: app-bridge 4, fondue 14 and React 18.

## Example

```ts
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'example',
            type: 'dropdown',
            defaultValue: 'solid',
            choices: [
                {
                    value: 'noline',
                    icon: 'DividerBlank',
                    label: 'Spacer (no line)',
                },
                {
                    value: 'solid',
                    icon: 'DividerSolid',
                    label: 'Line',
                },
            ],
            onChange: (bundle): void => {
                const blockWidth = Number(bundle.getBlock('widthCustom')?.value);
                if (!Number.isNaN(blockWidth)) {
                    bundle.setBlockValue('widthCustom', `${blockWidth}%`);
                }
            },
        },
    ],
});
```

# Block development helpers

## Code Structure

- `components` (React components which are reused across multiple blocks)
- `utilities` (functionality without business logic)
- `helpers` (functionality with business logic)

## Using components

To use React components, you need to add the styles import from the `@frontify/guideline-blocks-settings` package:

```ts
import '@frontify/guideline-blocks-settings/styles';
```

## Converting legacy rich text

The legacy rich text editor stores its value as Slate JSON. `convertLegacyRichText` turns a stored value into a document of the new rich text editor (`@frontify/fondue/rich-text-editor`). `toLegacyRichText` turns a document back into a legacy Slate tree. Both functions are pure: they never throw, and the same input always gives the same result.

```ts
import { convertLegacyRichText, toLegacyRichText } from '@frontify/guideline-blocks-settings';

const converted = convertLegacyRichText(storedValue, { resolveMention });

if (converted.outcome === 'exact') {
    const reverted = toLegacyRichText(converted.document, { columns: 2 });
}
```

`resolveMention(kind, id)` returns the names a mention shows: `{ status: 'resolved', username, name }`, or `{ status: 'unknown' }`. `kind` is empty for a person, or `'group'` or `'all'`. Without a resolver, every mention is unresolved. An unresolved mention keeps its legacy `value` as its name, with an empty username. `toLegacyRichText` writes a mention's `name` as its legacy `value`, the label legacy readers show.

`columns` is the column count of the legacy editor. The first `columns - 1` column breaks are active, the others inactive. The default is `1`.

### Outcomes

| Outcome           | Returned by             | Document or value | Meaning                                                    |
| ----------------- | ----------------------- | ----------------- | ---------------------------------------------------------- |
| `exact`           | both                    | yes               | Nothing was lost or guessed.                               |
| `requires-review` | `convertLegacyRichText` | yes               | The document keeps everything, but a person must check it. |
| `unsupported`     | `convertLegacyRichText` | `null`            | The value is not converted here.                           |
| `invalid`         | `convertLegacyRichText` | `null`            | The value is not a legacy value.                           |
| `not-reversible`  | `toLegacyRichText`      | `null`            | Part of the document has no legacy form.                   |

Each result has `diagnostics`: a list of `{ code, path }`. The path holds child indexes, from the root array for a legacy value or from `blocks` for a document. A diagnostic never holds text, URLs or ids from the value.

### Diagnostic codes

| Code                   | Outcome           | Cause                                                                               |
| ---------------------- | ----------------- | ----------------------------------------------------------------------------------- |
| `unknown-element`      | `requires-review` | An element type the new format does not have, or an element in the wrong place. It is kept as stored. |
| `unknown-property`     | `requires-review` | A property the new format does not have. It is kept as stored where the format allows it. |
| `mention-unresolved`   | `requires-review` | The resolver does not know the mention. Its id stays; its name is the legacy label, its username is empty.          |
| `link-unsafe`          | `requires-review` | A link address that is not http, https, mailto, tel or relative. The text stays without the link. |
| `link-conflict`        | `requires-review` | A link that shows another address or tab while it is edited than when it is viewed. It keeps what viewers see; if the chosen address is not text, it keeps the url. |
| `button-style-unknown` | `requires-review` | A button style other than primary, secondary or tertiary. It becomes a plain link.  |
| `color-unparsed`       | `requires-review` | A text colour that is not `rgb()`, `rgba()`, `#rgb`, `#rrggbb` or `#rrggbbaa`. It is removed. |
| `excluded-marks`       | `requires-review` | Text that is both subscript and superscript. It keeps subscript.                    |
| `indent-jump`          | `requires-review` | A to-do item indented more than one level below the item before it.                |
| `html-value`           | `unsupported`     | The value is HTML or plain text, not JSON.                                          |
| `reserved-type`        | `unsupported`     | An element that cannot be converted has the type name of a new-format block or inline, so it cannot be kept as stored. |
| `limit-exceeded`       | `unsupported`     | The value is over 5 MiB, 50,000 nodes, 64 levels deep or 1,000,000 characters in one text. |
| `invalid-value`        | `invalid`         | The value is JSON, but not an array.                                                |
| `invalid-node`         | `invalid`         | A node in the array is not a text or an element.                                    |
| `no-legacy-form`       | `not-reversible`  | The legacy format cannot hold this part of the document.                            |

## Development

The package uses the workspace versions of `@frontify/sidebar-settings` and `@frontify/app-bridge` from their `dist` folders, so build those first. From the repository root:

```sh
pnpm install
pnpm build:sidebar-settings
pnpm build:app-bridge
```

Then, in `packages/guideline-blocks-settings`:

| Command          | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `pnpm build`     | Builds the package; linked packages pick up the change directly |
| `pnpm test`      | Runs the tests                                                  |
| `pnpm lint`      | Runs the linter                                                 |
| `pnpm typecheck` | Runs the type checker                                           |

CI also checks the package against a published app-bridge version. To do the same locally, install that version temporarily from the repository root:

```sh
pnpm add @frontify/app-bridge@^4.0.0-alpha.0 --filter {packages/guideline-blocks-settings}
```

To switch back, restore `packages/guideline-blocks-settings/package.json` and `pnpm-lock.yaml`, then run `pnpm install`.
