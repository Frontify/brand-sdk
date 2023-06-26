# Block Settings

Provides the block settings types for the guideline-blocks.

## Example

```ts
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BlockSettings, Bundle } from '@frontify/guideline-blocks-settings';
import { IconEnum } from '@frontify/fondue';

export const settings: BlockSettings = {
    main: [
        {
            id: 'example',
            type: 'dropdown',
            size: 'Large',
            defaultValue: 'solid',
            choices: [
                {
                    value: 'noline',
                    icon: IconEnum.LineSpacer,
                    label: 'Spacer (no line)',
                },
                {
                    value: 'solid',
                    icon: IconEnum.LineSolid,
                    label: 'Line',
                },
            ],
            onChange: (bundle: Bundle): void => {
                const blockWidth = Number(bundle.getBlock('widthCustom')?.value);
                if (!Number.isNaN(blockWidth)) {
                    bundle.setBlockValue('widthCustom', `${blockWidth}%`);
                }
            },
        },
    ],
};
```

# Shared Package

## Code Structure

-   `components` (React components which are reused across multiple guideline-blocks)
-   `utilities` (Shared functionality without business logic)
-   `helpers` (Shared functionality with business logic)

You can get more informations in our [best practices guide](https://weare.frontify.com/auth/?referer=%2Fdocument%2F1405%23/getting-started/best-pratices).

## Development

Run `npm run build:watch` to make changes directly available to the linked packages.

## Using components

To use React components you need to modify the `tailwind.config.js` inside the consumer package the following way:

```
module.exports = {
    presets: [require('@frontify/fondue/tailwind'), require('../shared/tailwind.config')],
    content: ['src/**/*.{ts,tsx}', '../shared/src/**/*.{ts,tsx}'],
    corePlugins: {
        preflight: false,
    },
};
```
