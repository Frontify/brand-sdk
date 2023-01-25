/* (c) Copyright Frontify Ltd., all rights reserved. */

import 'tailwindcss/tailwind.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { settings } from './settings';
import { AnExamplePlatformApp } from './PlatformApp';

export default defineBlock({
    block: AnExamplePlatformApp,

    // Interesting could be to define the
    // scopes and entry points in the settings
    settings,
});
