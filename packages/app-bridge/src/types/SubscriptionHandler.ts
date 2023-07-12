/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';
import { TemplateLegacy } from './TemplateLegacy';

export type Subscription = 'AssetChooser.AssetChosen';

export type SubscriptionCallback = {
    'AssetChooser.AssetChosen': (selectedAssets: Asset[]) => void;
    'TemplateChooser.TemplateChosen': (selectedTemplate: TemplateLegacy) => void;
};
