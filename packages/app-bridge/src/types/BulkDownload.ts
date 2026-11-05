/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetBulkDownloadToken = {
    assetIds: number[];
    setIds: number[];
    language: string;
};

export type BulkDownload = {
    downloadUrl: string;
    signature: string;
};
