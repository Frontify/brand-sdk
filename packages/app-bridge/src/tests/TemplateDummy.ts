/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Template } from '../types';

export class TemplateDummy {
    static with(id: number): Template {
        return {
            id,
            name: 'A template',
            description: 'A description',
            previewUrl: 'https://preview.url',
            projectId: 23,
            pages: [
                {
                    preview_url: 'https://preview.url',
                    width: 1024,
                    height: 768,
                },
            ],
        };
    }
}
