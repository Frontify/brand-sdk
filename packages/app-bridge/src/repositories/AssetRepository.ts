/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset, type AssetApi } from '../types';
import { HttpClient } from '../utilities';

export const createAssetByFileId = async (fileId: string, projectId: number, setId?: number): Promise<Asset> => {
    const { result } = await HttpClient.post<AssetApi>('/api/asset', {
        file_id: fileId,
        project_id: projectId,
        set_id: setId,
    });

    return { ...result.data, ...mapAssetApiToAsset(result.data) };
};

export const mapAssetApiToAsset = (asset: AssetApi): Asset => {
    return {
        id: asset.id,
        alternativeText: asset.alternative_text,
        objectType: asset.object_type,
        extension: asset.ext,
        creatorName: asset.creator_name,
        externalUrl: asset.external_url,
        genericUrl: asset.generic_url,
        previewUrl: asset.preview_url,
        originUrl: asset.file_origin_url,
        fileName: asset.file_name,
        fileSize: asset.file_size,
        fileSizeHumanReadable: asset.file_size_formatted,
        height: asset.height,
        width: asset.width,
        projectId: asset.project_id,
        status: asset.status,
        title: asset.title,
        fileId: asset.file_id,
        token: asset.token,
        projectType: asset.project_type,
        revisionId: asset.revision_id,
        backgroundColor: asset.background_color,
        isDownloadProtected: asset.is_download_protected,
    };
};
