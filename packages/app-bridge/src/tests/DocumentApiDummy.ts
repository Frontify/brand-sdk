/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentApi, LinkType } from '../types';

export class DocumentApiDummy {
    static with(id: number): DocumentApi {
        return {
            id,
            creator: 9,
            created: '2022-03-03t15:41:33.000+00:00',
            modifier: null,
            modified: null,
            project_id: 345,
            valid_from: '2022-03-03t15:41:33.000+00:00',
            valid_to: null,
            visibility: 'private',
            portal_id: 3495,
            title: `Document ${id}`,
            slug: `document-${id}`,
            heading: 'Document Dummy heading',
            subheading: 'Document Dummy subHeading',
            description: null,
            logo: null,
            layout: null,
            sort: 5,
            lazy: true,
            link_type: LinkType.Internal,
            link_url: null,
            link_settings: null,
            view_count: 0,
            mode: 'DEFAULT',
            appearance: null,
            settings: {},
            logo_file_id: null,
            logo_settings: [],
            background_file_id: null,
            background_settings: [],
            change_processed: null,
            change_processed_by: null,
            change_skipped: null,
            change_skipped_by: null,
            change_comment: null,
            change_comment_by: null,
            change_title: null,
            targets: [],
            token: 'a-dummy-token',
        };
    }
}
