/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CamelCasedPropertiesDeep, type RequireAtLeastOne, type SetOptional, type Simplify } from 'type-fest';

import { type SingleTargetApi } from './Targets';

export type DocumentLibraryMode =
    | 'MEDIALIBRARY'
    | 'ICONLIBRARY'
    | 'LOGOLIBRARY'
    | 'DOCUMENTLIBRARY'
    | 'TEMPLATELIBRARY'
    | 'TEXTLIBRARY'
    | 'PATTERNLIBRARY'
    | 'BRANDUPDATELIBRARY';

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

export type DocumentLinkSettingsApi = {
    new_tab: boolean;
    display?: LinkSettingsDisplay;
    icon_position?: LinkSettingsIconPosition;
    file_id?: string;
    screen_id?: number;
    icon_url?: string;
    icon_file_name?: string;
};

type DocumentAsLink = CamelCasedPropertiesDeep<DocumentApiAsLink>;
type DocumentAsNoneLink = CamelCasedPropertiesDeep<DocumentApiAsNoneLink>;

export type DocumentApi = Simplify<
    {
        id: number;
        creator: number;
        created: string;
        modifier: Nullable<number>;
        modified: Nullable<string>;
        project_id: number;
        document_group_id?: Nullable<number>;
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
        sort: number;
        lazy: Nullable<boolean>;
        link_settings: Nullable<DocumentLinkSettingsApi>;
        view_count: Nullable<number>;
        mode: DocumentMode;
        settings: {
            project?: number;
            project_slug?: string;
            facettes?: any[];
        };
        appearance: Nullable<Record<string, any>>;
        logo_file_id: Nullable<string>;
        logo_settings: Nullable<any>;
        background_file_id: Nullable<string>;
        background_settings: Nullable<any>;
        targets: Nullable<SingleTargetApi['target'][]>;
        token: Nullable<string>;
        permanent_link: string;

        // Enriched fields
        number_of_document_page_categories: number;
        number_of_uncategorized_document_pages: number;
    } & (DocumentApiAsLink | DocumentApiAsNoneLink)
>;

export type Document = CamelCasedPropertiesDeep<DocumentApi>;

export type DocumentLink = Simplify<Document & DocumentAsLink>;

export type DocumentLibrary = Simplify<
    Document & DocumentAsNoneLink & { settings?: { project: number }; mode: DocumentLibraryMode }
>;

export type DocumentStandard = Simplify<Document & DocumentAsNoneLink>;

export type DocumentLinkSettings = CamelCasedPropertiesDeep<DocumentLinkSettingsApi>;

export enum LinkSettingsDisplay {
    TextAndIcon = 'ICON_TEXT',
    IconOnly = 'ICON',
    TextOnly = 'TEXT',
}

export enum LinkSettingsIconPosition {
    Right = 'RIGHT',
    Left = 'LEFT',
}

type DocumentLinkRequest = {
    id: number;
    title: string;
    linkUrl: string;
    linkSettings: DocumentLinkSettings;
    documentGroupId?: Nullable<number>;
};

type DocumentLibraryRequest = {
    id: number;
    mode: DocumentLibraryMode;
    settings: { project: number };
    title: string;
    heading?: string;
    subheading?: string;
    documentGroupId?: Nullable<number>;
};

type DocumentStandardRequest = {
    id: number;
    title: string;
    documentGroupId?: Nullable<number>;
};

export type DocumentStandardCreate = Omit<DocumentStandardRequest, 'id'>;
export type DocumentStandardUpdate = RequireAtLeastOne<DocumentStandardRequest, 'documentGroupId' | 'title'>;
export type DocumentStandardDelete = Pick<DocumentStandardRequest, 'documentGroupId' | 'id'>;

export type DocumentLibraryCreate = SetOptional<
    Omit<DocumentLibraryRequest, 'id'>,
    'heading' | 'subheading' | 'settings'
>;
export type DocumentLibraryUpdate = RequireAtLeastOne<
    DocumentLibraryRequest,
    'documentGroupId' | 'heading' | 'mode' | 'settings' | 'subheading' | 'title'
>;
export type DocumentLibraryDelete = Pick<DocumentLibraryRequest, 'id' | 'documentGroupId'>;

export type DocumentLinkCreate = Omit<DocumentLinkRequest, 'id'>;
export type DocumentLinkUpdate = RequireAtLeastOne<
    DocumentLinkRequest,
    'title' | 'linkUrl' | 'linkSettings' | 'documentGroupId'
>;
export type DocumentLinkDelete = Pick<DocumentLinkRequest, 'id' | 'documentGroupId'>;
