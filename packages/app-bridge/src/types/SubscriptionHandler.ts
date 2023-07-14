/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset } from './Asset';
import { TemplateLegacy } from './TemplateLegacy';

export type Subscription = keyof SubscriptionCallback;

export type SubscriptionCallback = {
    assetsChosen: (selectedAssets: Asset[]) => void;
    templateChosen: (selectedTemplate: TemplateLegacy) => void;
};
