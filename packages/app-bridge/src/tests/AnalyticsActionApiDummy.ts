/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AnalyticsActionApi, Asset, FileExtension } from '../types';

export class AnalyticsActionsApiDummy {
    static with(asset: Asset, brandId?: number): AnalyticsActionApi {
        return {
            type: 'asset:download',
            brandId: brandId ?? 1,
            properties: {
                asset_ext: FileExtension.Png,
                asset_id: asset.id,
                download_type: 'PRESSKIT',
                project_id: asset.projectId,
                project_type: 'BROWSER',
                revision_id: asset.revisionId,
                via: 'STYLEGUIDE',
                via_id: 652,
            },
        };
    }

    static withDocumentId(asset: Asset, documentId: number, brandId: number) {
        return {
            type: 'asset:download',
            brandId,
            properties: {
                ...AnalyticsActionsApiDummy.with(asset, brandId).properties,
                document_id: documentId,
            },
        };
    }
}
