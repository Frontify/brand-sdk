/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from './Asset';

export type Subscription = 'assetsChosen';

export type SubscriptionCallback = {
    assetsChosen: (selectedAssets: Asset[]) => void;
};
