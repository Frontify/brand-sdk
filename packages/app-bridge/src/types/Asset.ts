/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Nullable } from './Nullable';

export type Asset = {
    id: number;
    alternativeText: Nullable<string>;
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
    revisionId: Nullable<number>;
    backgroundColor: Nullable<string>;
    isDownloadProtected: boolean;
    focalPointX: Nullable<number>;
    focalPointY: Nullable<number>;
};
