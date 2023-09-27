/* (c) Copyright Frontify Ltd., all rights reserved. */

export type AssetApi = {
    id: number;
    creator_name: string;
    ext: string;
    external_url: Nullable<string>;
    file_name: string;
    title: string;
    status: string;
    object_type: string;
    height: Nullable<number>;
    width: Nullable<number>;
    generic_url: string;
    preview_url: string;
    file_origin_url: string;
    project_id: number;
    file_size: number;
    file_size_formatted: string;
    file_id: string;
    project_name: Nullable<string>;
    project_type: Nullable<string>;
    token: string;
    revision_id: Nullable<number>;
};

export type Asset = {
    id: number;
    creatorName: string;
    extension: string;
    externalUrl: Nullable<string>;
    fileName: string;
    title: string;
    status: string;
    objectType: string;
    height: Nullable<number>;
    width: Nullable<number>;
    genericUrl: string;
    previewUrl: string;
    originUrl: string;
    projectId: number;
    fileSize: number;
    fileSizeHumanReadable: string;
    fileId: string;
    token: string;
    projectType: Nullable<string>;
    revisionId: Nullable<number>;
};
