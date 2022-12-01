/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CoverPageApi } from '../types';

export class CoverPageApiDummy {
    static with(id: number, title = 'Cover Page Name'): CoverPageApi {
        return {
            template: 'hub',
            document_id: '1',
            brandhome: {
                id,
                title,
                active: true,
                draft: 1,
                enabled: 1,
                url: `/hub/${id}`,
                hide_in_nav: false,
            },
        };
    }
}
