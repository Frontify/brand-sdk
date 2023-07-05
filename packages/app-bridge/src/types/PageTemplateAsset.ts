/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SnakeCasedPropertiesDeep } from 'type-fest';
import type { Asset, AssetApi } from './Asset';

export type PageTemplateAssetApi = Omit<SnakeCasedPropertiesDeep<PageTemplateAsset>, 'asset'> & { asset: AssetApi };

export type PageTemplateAsset = {
    id: number;
    creator: number;
    created: string;
    modifier: Nullable<number>;
    modified: Nullable<string>;
    validTo: Nullable<string>;
    settingId: string;
    assetId: number;

    // Enriched
    asset: Asset;
};
