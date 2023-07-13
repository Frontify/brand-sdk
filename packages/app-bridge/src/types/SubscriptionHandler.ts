/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { TemplateLegacy } from './TemplateLegacy';

export type Subscription = 'assetsChosen' | 'templateChosen';

export type SubscriptionCallback = {
    assetsChosen: (selectedAssets: Asset[]) => void;
    templateChosen: (selectedTemplate: TemplateLegacy) => void;
};
