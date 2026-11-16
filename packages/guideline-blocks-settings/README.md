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
