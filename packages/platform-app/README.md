# Platform App Types

## Code Structure
Defines the App and gives typing for the settings

```ts
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineApp } from '@frontify/platform-app';
import { settings } from './settings';

export default defineApp({
    app: App,
    settings,
});
```

## Settings Definition

Provides settings types for Platform Apps

## Example

```ts
/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineSettings } from '@frontify/platform-app';

export const settings = defineSettings({
    credentials: [
        {
            type: 'input',
            id: 'api-token',
            label: 'API Token',
        },
    ],
});
```
