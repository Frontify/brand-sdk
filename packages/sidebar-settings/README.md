# Sidebar Settings

Provides the settings types for the guideline-blocks.

## Example

```ts
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BlockSettings, Bundle } from '@frontify/guideline-blocks-settings';

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
                    icon: 'LineSpacer',
                    label: 'Spacer (no line)',
                },
                {
                    value: 'solid',
                    icon: 'LineSolid',
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
