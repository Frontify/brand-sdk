/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CamelCasedPropertiesDeep } from 'type-fest';

export type GenerateBulkDownloadTokenRequestApi = {
    asset_ids: number[];
    set_ids: number[];
    language: string;
};

export type GenerateBulkDownloadTokenRequest = CamelCasedPropertiesDeep<GenerateBulkDownloadTokenRequestApi>;

export type BulkDownloadApi = {
    download_url: string;
    signature: string;
};

export type BulkDownload = CamelCasedPropertiesDeep<BulkDownloadApi>;
