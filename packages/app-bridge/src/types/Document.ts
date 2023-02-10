/* (c) Copyright Frontify Ltd., all rights reserved. */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CamelCasedPropertiesDeep, RequireAtLeastOne, SetOptional, Simplify } from 'type-fest';

/**
 * @deprecated fields that are not used anymore
 */
type DocumentApiDeprecatedFields = {
    layout: Nullable<string>;
};

/**
 * virtual fields of Document that wont be returned by API
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
    link_type: 'EXTERNAL';
    link_url: string;
};

type DocumentApiAsNoneLink = {
    link_type: 'INTERNAL';
    link_url: Nullable<never>;
};

type DocumentAsLink = CamelCasedPropertiesDeep<DocumentApiAsLink>;
type DocumentAsNoneLink = CamelCasedPropertiesDeep<DocumentApiAsNoneLink>;

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

export type DocumentLink = Simplify<Document & DocumentAsLink & { linkSettings: { newTab: boolean } }>;

export type DocumentLibrary = Simplify<
    Document & DocumentAsNoneLink & { settings?: { project: number }; mode: DocumentLibraryMode }
>;

export type DocumentStandard = Simplify<Document & DocumentAsNoneLink>;

type DocumentLinkRequest = {
    id: number;
    title: string;
    linkUrl: string;
    linkSettings: {
        newTab: boolean;
    };
    documentGroupId?: number;
};
type DocumentLibraryRequest = {
    id: number;
    mode: DocumentLibraryMode;
    settings: { project: number };
    title: string;
    heading?: string;
    subheading?: string;
    documentGroupId?: number;
};

type DocumentStandardRequest = {
    id: number;
    title: string;
    documentGroupId?: number;
};

export type DocumentStandardCreate = Omit<DocumentStandardRequest, 'id'>;
export type DocumentStandardUpdate = RequireAtLeastOne<DocumentStandardRequest, 'documentGroupId' | 'title'>;

export type DocumentLibraryCreate = SetOptional<
    Omit<DocumentLibraryRequest, 'id'>,
    'heading' | 'subheading' | 'settings'
>;
export type DocumentLibraryUpdate = RequireAtLeastOne<
    DocumentLibraryRequest,
    'documentGroupId' | 'heading' | 'mode' | 'settings' | 'subheading' | 'title'
>;

export type DocumentLinkCreate = Omit<DocumentLinkRequest, 'id'>;
export type DocumentLinkUpdate = RequireAtLeastOne<
    DocumentLinkRequest,
    'title' | 'linkUrl' | 'linkSettings' | 'documentGroupId'
>;
