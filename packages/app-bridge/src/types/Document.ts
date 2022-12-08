/* (c) Copyright Frontify Ltd., all rights reserved. */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CamelCasedPropertiesDeep, Simplify } from 'type-fest';

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

export enum LinkType {
    External = 'EXTERNAL',
    Internal = 'INTERNAL',
}

type DocumentApiAsLink = {
    link_type: Extract<keyof typeof LinkType, 'EXTERNAL'>;
    link_url: string;
};

type DocumentApiAsNoneLink = {
    link_type?: Extract<keyof typeof LinkType, 'INTERNAL'>;
    link_url?: never;
};

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
            heading?: Nullable<string>;
            subheading?: Nullable<string>;
            description: Nullable<string>;
            logo: Nullable<string>;
            sort: Nullable<number>;
            lazy: Nullable<boolean>;
            link_settings: Nullable<any>;
            view_count: Nullable<number>;
            mode: DocumentMode;
            settings: any[];
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
        } & (DocumentApiAsLink | DocumentApiAsNoneLink)
>;

export type Document = CamelCasedPropertiesDeep<DocumentApi>;

type DocumentAsLink = CamelCasedPropertiesDeep<DocumentApiAsLink>;
type DocumentAsNoneLink = CamelCasedPropertiesDeep<DocumentApiAsNoneLink>;

export type DocumentLinkValidFields = 'linkSettings' | 'title' | 'documentGroupId' | 'id';
export type DocumentStandardValidFields = 'title' | 'documentGroupId' | 'id';
export type DocumentLibraryValidFields =
    | 'mode'
    | 'settings'
    | 'title'
    | 'heading'
    | 'subheading'
    | 'documentGroupId'
    | 'id';

export type DocumentLink = Simplify<Document & DocumentAsLink & { linkSettings: { newTab: boolean } }>;

export type DocumentLibrary = Simplify<
    Document & DocumentAsNoneLink & { settings: { project: number }; mode: DocumentLibraryMode }
>;

export type ValidDocumentLink = Pick<DocumentLink, DocumentLinkValidFields>;
export type ValidDocumentLibrary = Pick<DocumentLibrary, DocumentLibraryValidFields>;
export type ValidDocumentStandard = Pick<Document, DocumentStandardValidFields>;
