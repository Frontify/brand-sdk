/* (c) Copyright Frontify Ltd., all rights reserved. */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CamelCasedPropertiesDeep, SetRequired, Simplify } from 'type-fest';

/**
 * @deprecated fields that are not used anymore
 */
type DocumentApiDeprecatedFields = {
    layout: Nullable<string>;
};

/**
 * virtual fields of Document
 */
type DocumentApiVirtualFields = {
    document_group_id?: Nullable<number>;
};

export type DocumentLibraryMode = 'MEDIALIBRARY' | 'ICONLIBRARY' | 'LOGOLIBRARY' | 'DOCUMENTLIBRARY';
export type DocumentMode = Simplify<'DEFAULT' | DocumentLibraryMode>;

export type DocumentApi = Simplify<
    DocumentApiDeprecatedFields &
        DocumentApiVirtualFields & {
            id: number;
            creator: number;
            created: string;
            modifier: Nullable<number>;
            modified: Nullable<string>;
            project_id: number;
            valid_from: string;
            valid_to: Nullable<string>;
            visibility: Nullable<string>;
            portal_id: Nullable<number>;
            title: string;
            slug: Nullable<string>;
            heading: Nullable<string>;
            subheading: Nullable<string>;
            description: Nullable<string>;
            logo: Nullable<string>;
            sort: Nullable<number>;
            lazy: Nullable<boolean>;
            link_type: string;
            link_url: Nullable<string>;
            link_settings: Nullable<any>;
            view_count: Nullable<number>;
            mode: DocumentMode;
            settings: Nullable<Record<string, any>>;
            appearance: Nullable<Record<string, any>>;
            logo_file_id: Nullable<string>;
            logo_settings: Nullable<any>;
            background_file_id: Nullable<string>;
            background_settings: Nullable<any>;
            change_processed: Nullable<string>;
            change_processed_by: Nullable<string>;
            change_skipped: Nullable<string>;
            change_skipped_by: Nullable<string>;
            change_comment: Nullable<string>;
            change_comment_by: Nullable<string>;
            change_title: Nullable<string>;
            targets: any;
        }
>;

export type Document = CamelCasedPropertiesDeep<DocumentApi>;

export type DocumentLink = Simplify<
    PickRequired<Document, 'title' | 'linkUrl' | 'linkType' | 'portalId' | 'documentGroupId'> & {
        categoryId?: number;
        documentGroupId?: number;
        linkSettings: {
            newTab: boolean;
        };
    }
>;

export type DocumentLibrary = Simplify<
    PickRequired<Document, 'title' | 'portalId' | 'heading' | 'subheading' | 'documentGroupId'> & {
        documentGroupId?: number;
        settings: { project: number };
        mode: DocumentLibraryMode;
    }
>;

export type CreateDocumentLink = Pick<
    DocumentLink,
    'linkUrl' | 'portalId' | 'title' | 'linkSettings' | 'documentGroupId'
>;

export type UpdateDocumentLink = SetRequired<
    Partial<Pick<DocumentLink, 'linkUrl' | 'portalId' | 'title' | 'linkSettings' | 'id'>>,
    'id'
>;

export type CreateDocumentLibrary = Pick<
    DocumentLibrary,
    'title' | 'mode' | 'portalId' | 'settings' | 'documentGroupId'
>;

export type UpdateDocumentLibrary = SetRequired<
    Partial<Pick<DocumentLibrary, 'title' | 'mode' | 'portalId' | 'settings' | 'id'>>,
    'id'
>;

export type CreateDocumentStandard = Pick<Document, 'title' | 'portalId' | 'documentGroupId'>;

export type UpdateDocumentStandard = SetRequired<Partial<Pick<Document, 'title' | 'portalId' | 'id'>>, 'id'>;
