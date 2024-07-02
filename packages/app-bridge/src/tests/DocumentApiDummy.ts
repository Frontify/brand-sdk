/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentApi, LinkType } from '../types';

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
            targets: [],
            token: 'a-dummy-token',
            permanent_link: `/r/document-${id}`,
            number_of_document_page_categories: 0,
            number_of_uncategorized_document_pages: 0,
        };
    }
}
