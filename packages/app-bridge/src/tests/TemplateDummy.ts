/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { TemplateLegacy } from '../types';

export class TemplateDummy {
    static with(id: number): TemplateLegacy {
        return {
            id,
            title: 'A template',
            description: 'A description',
            previewUrl: 'https://preview.url',
            projectId: 23,
            height: 480,
            width: 640,
            published: true,
        };
    }
}
