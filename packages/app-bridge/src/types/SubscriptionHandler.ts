/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset } from './Asset';

export type Subscription = keyof SubscriptionCallback;

export type SubscriptionCallback = {
    assetsChosen: (selectedAssets: Asset[]) => void;
};
