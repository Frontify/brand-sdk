/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset, FileExtension } from './';

export type AssetDownloadType = 'PRESSKIT';

export type TrackingEventName = 'asset:download';

export type TrackAssetDownload = {
    name: TrackingEventName;
    data: {
        assets: Asset[];
    };
};

export type TrackAssetDownloadPayload = {
    asset_id: number;
    revision_id: number;
    asset_ext: FileExtension;
    via: 'STYLEGUIDE';
    via_id: number;
    document_id: number;
    download_type: string;
    project_id: number;
    project_type: 'BROWSER' | 'NATIVE';
};

export type AnalyticsActionApi = {
    type: TrackingEventName;
    brandId: number;
    properties: TrackAssetDownloadPayload;
};
