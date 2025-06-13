/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CoverPage } from '../types';
import { convertObjectCase } from '../utilities';

import { CoverPageApiDummy } from './CoverPageApiDummy';

type CoverPageUpdateLegacy = {
    brandhome_draft?: boolean;
    brandhome_title?: string;
    brandhome_hide_in_nav?: boolean;
};
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

    static withLegacy(_id: number, title = 'Legacy Cover Page'): CoverPageUpdateLegacy {
        return {
            brandhome_draft: true,
            brandhome_title: title,
            brandhome_hide_in_nav: false,
        };
    }
}
