/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentPageVisibility, type DocumentPageApi } from '@frontify/app-bridge';

enum LinkType {
    External = 'EXTERNAL',
    Internal = 'INTERNAL',
}

type DocumentLinkSettingsApi = {
    new_tab: boolean;
    display?: 'ICON_TEXT' | 'ICON' | 'TEXT';
    icon_position?: 'RIGHT' | 'LEFT';
    file_id?: string;
    screen_id?: number;
    icon_url?: string;
    icon_file_name?: string;
};

type DocumentApiAsLink = {
    link_type: 'EXTERNAL';
    link_url: string;
};

type DocumentApiAsNoneLink = {
    link_type: 'INTERNAL';
    link_url: null | undefined;
};

type DocumentApi = {
    id: number;
    creator: number;
    created: string;
    modifier: number | null;
    modified: string | null;
    project_id: number;
    document_group_id?: number | null;
    valid_from: string;
    valid_to: string | null;
    visibility: string | null;
    portal_id: number | null;
    title: string;
    slug: string | null;
    heading: string | null;
    subheading: string | null;
    description: string | null;
    logo: string | null;
    sort: number;
    lazy: boolean | null;
    link_settings: DocumentLinkSettingsApi | null;
    view_count: number | null;
    mode:
        | 'DEFAULT'
        | 'MEDIALIBRARY'
        | 'ICONLIBRARY'
        | 'LOGOLIBRARY'
        | 'DOCUMENTLIBRARY'
        | 'TEMPLATELIBRARY'
        | 'TEXTLIBRARY'
        | 'BRANDUPDATELIBRARY';
    settings: {
        project?: number;
        project_slug?: string;
        facettes?: any[];
    };
    appearance: Record<string, any> | null;
    logo_file_id: string | null;
    logo_settings: any[] | null;
    background_file_id: string | null;
    background_settings: any[] | null;
    targets: any[] | null;
    token: string | null;
    permanent_link: string;

    // Enriched / computed fields (often added by backend or frontend)
    number_of_document_page_categories: number;
    number_of_uncategorized_document_pages: number;
} & (DocumentApiAsLink | DocumentApiAsNoneLink);

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

export class DocumentPageApiDummy {
    static with(id: number): DocumentPageApi {
        return {
            id,
            creator: 9,
            created: '2022-08-15T11:47:57.000+00:00',
            modifier: null,
            modified: null,
            document_id: 145,
            category_id: 29,
            parent_id: null,
            valid_from: '2022-08-15T11:47:57.000+00:00',
            valid_to: null,
            title: `Document Page Dummy ${id}`,
            slug: `document-page-dummy-${id}`,
            sort: 1,
            link_type: 'INTERNAL',
            link_url: null,
            view_count: 0,
            visibility: DocumentPageVisibility.Everyone,
            targets: null,
            permanent_link: `/r/document-page-${id}`,
        } as DocumentPageApi;
    }

    static withFields(fields: Partial<DocumentPageApi> & { id: number }): DocumentPageApi {
        return {
            ...DocumentPageApiDummy.with(fields.id),
            ...fields,
        } as DocumentPageApi;
    }
}
