/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AssetChooserResult } from '../types';

export class AssetChooserResultDummy {
    static with(id: number): AssetChooserResult {
        return {
            id,
            creator_name: 'Creator Name',
            computed_alternative_text: 'Alternative Text',
            ext: 'png',
            external_url: null,
            file_id: 'x1x1x1x1x1x1',
            file_name: 'fileName.png',
            generic_url: 'https://generic.url',
            height: 480,
            object_type: 'IMAGE',
            file_origin_url: 'https://origin.url',
            preview_url: 'https://preview.url',
            project: 23,
            project_name: null,
            project_type: 'STYLEGUIDE',
            filesize: 256,
            file_size_formatted: '123.45 MB',
            status: 'FINISHED',
            title: 'A title',
            width: 640,
            token: '--token--',
            revision_id: 1,
            background_color: 'rgba(115, 210, 210, 255)',
            is_download_protected: false,
            focal_point_x: 0.5,
            focal_point_y: 0.5,
        };
    }
}
