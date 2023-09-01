/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CamelCasedPropertiesDeep } from 'type-fest';

export type GetBulkDownloadTokenApi = {
    asset_ids: number[];
    set_ids: number[];
    language: string;
};

export type GetAssetBulkDownloadTokenApi = {
    setting_ids?: string[];
};

export type GetBulkDownloadToken = CamelCasedPropertiesDeep<GetBulkDownloadTokenApi>;
export type GetAssetBulkDownloadToken = CamelCasedPropertiesDeep<GetAssetBulkDownloadTokenApi>;

export type BulkDownloadApi = {
    download_url: string;
    signature: string;
};

export type BulkDownload = CamelCasedPropertiesDeep<BulkDownloadApi>;
