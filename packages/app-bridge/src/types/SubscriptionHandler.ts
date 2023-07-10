/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';

export type Subscription = 'AssetChooser.AssetChosen';

export type SubscriptionCallback = {
    'AssetChooser.AssetChosen': (selectedAssets: Asset[]) => void;
};
