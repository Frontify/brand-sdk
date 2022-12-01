/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Document } from '../types';

export class DocumentDummy {
    static with(id: number): Document {
        return {
            id,
            creator: 9,
            created: '2022-03-03t15:41:33.000+00:00',
            modifier: null,
            modified: null,
            projectId: 345,
            validFrom: '2022-03-03t15:41:33.000+00:00',
            validTo: null,
            visibility: 'private',
            portalId: 3495,
            title: `Document ${id}`,
            slug: `document-${id}`,
            heading: 'Document Dummy heading',
            subheading: 'Document Dummy subHeading',
            description: null,
            logo: null,
            layout: null,
            sort: 5,
            lazy: true,
            linkType: 'internal',
            linkUrl: null,
            linkSettings: null,
            viewCount: 0,
            mode: 'DEFAULT',
            appearance: null,
            settings: [],
            logoFileId: null,
            logoSettings: [],
            backgroundFileId: null,
            backgroundSettings: [],
            changeProcessed: null,
            changeProcessedBy: null,
            changeSkipped: null,
            changeSkippedBy: null,
            changeComment: null,
            changeCommentBy: null,
            changeTitle: null,
            targets: [],
        };
    }
}
