/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Screen = {
    id: number;
    created: string;
    modified: string;
    ext: string;
    objectType: string;
    status: string;
    filename: string;
    backgroundColor: string;
    height: Nullable<number>;
    width: Nullable<number>;
    title: string;
    previewFileId: Nullable<number>;
    previewSettings: Nullable<string>;
    projectId: Nullable<number>;
    project: Nullable<number>;
    token: string;
    genericUrl: string;
    previewUrl: string;
    fileId: string;
};
