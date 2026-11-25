/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Template } from '../types';

export class TemplateDummy {
    static with(id: number): Template {
        return {
            id,
            name: 'A template',
            description: 'A description',
            previewUrl: 'https://preview.url',
            creationFormUri: `/publishing/template/${id}`,
            projectId: 23,
            pages: [
                {
                    previewUrl: 'https://preview.url',
                    width: 1024,
                    height: 768,
                },
            ],
        };
    }
}
