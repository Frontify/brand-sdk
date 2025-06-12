/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from '../types/Asset';

export class AssetDummy {
    static with(id: number): Asset {
        return {
            id,
            creatorName: 'Creator Name',
            alternativeText: 'Alternative Text',
            extension: 'png',
            externalUrl: null,
            fileName: 'fileName.png',
            title: 'A title',
            status: 'FINISHED',
            objectType: 'IMAGE',
            height: 480,
            width: 640,
            genericUrl: 'https://generic.url',
            previewUrl: 'https://preview.url',
            originUrl: 'https://origin.url',
            projectId: 23,
            fileSize: 256,
            fileSizeHumanReadable: '123.45 MB',
            fileId: 'x1x1x1x1x1x1',
            token: '--token--',
            projectType: 'STYLEGUIDE',
            revisionId: 1,
            backgroundColor: 'rgba(115, 210, 210, 255)',
            isDownloadProtected: false,
        };
    }
}
