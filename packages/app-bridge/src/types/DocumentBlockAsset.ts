/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset } from './Asset';

export type DocumentBlockAsset = {
    id: number;
    creator: number;
    created: string;
    modifier: number;
    modified: string;
    validTo: Nullable<string>;
    documentBlockId: number;
    settingId: string;
    assetId: number;

    // Enriched
    asset: Asset;
};
