/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Template } from '../types';
import { convertObjectCase } from '../utilities';

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
                    ...convertObjectCase(
                        {
                            preview_url: 'https://preview.url',
                            width: 1024,
                            height: 768,
                        },
                        'camel',
                    ),
                },
            ],
        };
    }
}
