/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CoverPage, type CoverPageUpdateLegacy } from '../types';
import { convertObjectCase } from '../utilities';

import { CoverPageApiDummy } from './CoverPageApiDummy';

export class CoverPageDummy {
    static with(id: number, title = 'Cover Page Name'): CoverPage {
        const coverPageApi = CoverPageApiDummy.with(id, title);

        return {
            ...convertObjectCase(coverPageApi.brandhome, 'camel'),
            template: coverPageApi.template,
            documentId: coverPageApi.document_id,
            draft: Boolean(coverPageApi.brandhome.draft),
            enabled: Boolean(coverPageApi.brandhome.enabled),
        };
    }

    static withLegacy(id: number, title = 'Legacy Cover Page'): CoverPageUpdateLegacy {
        return {
            brandhome_draft: true,
            brandhome_title: title,
            brandhome_hide_in_nav: false,
        };
    }
}
