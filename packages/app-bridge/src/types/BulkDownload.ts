/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GenerateBulkDownloadTokenRequest = {
    asset_ids: number[];
    set_ids: number[];
    language: string;
};

export type BulkDownload = {
    download_url: string;
    signature: string;
};
