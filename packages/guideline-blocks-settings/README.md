# Block Settings

Provides the block settings types for the guideline-blocks.

## Example

```ts
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'example',
            type: 'dropdown',
            size: 'Large',
            defaultValue: 'solid',
            choices: [
                {
                    value: 'noline',
                    icon: 'LineSpacer',
                    label: 'Spacer (no line)',
                },
                {
                    value: 'solid',
                    icon: 'LineSolid',
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

-   `components` (React components which are reused across multiple blocks)
-   `utilities` (functionality without business logic)
-   `helpers` (functionality with business logic)

## Using components

To use React components, you need to add the styles import from the `@frontify/guideline-blocks-settings` package:

```
import '@frontify/guideline-blocks-settings/styles';
```

## Development

Run `pnpm build` to make changes directly available to the linked packages.

To run the tests, linter, or type checker, first update @frontify/app-bridge. For the latest version, execute:

```
pnpm add @frontify/app-bridge@workspace:^ --filter {packages/guideline-blocks-settings}
```

For a specific version, such as 3.0.2, execute:

```
pnpm add @frontify/app-bridge@3.0.2 --filter {packages/guideline-blocks-settings}
```

After updating, you can run the following commands as needed. For testing, use `pnpm test`. For linting, use `pnpm lint`. For type checking, use `pnpm typecheck`.
