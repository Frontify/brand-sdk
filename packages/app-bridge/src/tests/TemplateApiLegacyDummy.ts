/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type TemplateApiLegacy } from '../types';

export class TemplateApiLegacyDummy {
    static with(id: number): TemplateApiLegacy {
        return {
            asset_created: '2022-04-06',
            asset_modified: '2022-04-06',
            categories: [],
            description: 'A description',
            height: 480,
            id,
            name: 'A template',
            preview: 'https://preview.url',
            project: 23,
            project_name: 'A project',
            project_type: 'A project type',
            published: 1,
            screen_id: 1,
            width: 640,
        };
    }
}
