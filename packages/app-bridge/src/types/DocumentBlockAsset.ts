/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SnakeCasedPropertiesDeep } from 'type-fest';
import type { Asset, AssetApi } from './Asset';

export type DocumentBlockAssetApi = Omit<SnakeCasedPropertiesDeep<DocumentBlockAsset>, 'asset'> & { asset: AssetApi };

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
