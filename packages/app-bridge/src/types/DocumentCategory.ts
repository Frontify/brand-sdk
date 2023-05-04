/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, Merge, RequireAtLeastOne } from 'type-fest';

import type { DocumentPageApi } from './DocumentPage';

export type DocumentCategoryApi = {
    id: number;
    document_id: number;
    slug: string;
    title: string;
    sort: number;
    creator: number;
    created: string;
    modifier: Nullable<string>;
    modified: Nullable<string>;
    valid_from: string;
    valid_to: Nullable<string>;
    document_pages: Nullable<DocumentPageApi[]>;
    number_of_document_pages: number;
};

type DocumentPageRequestFields = 'title' | 'documentId' | 'id';

export type DocumentCategory = Merge<CamelCasedPropertiesDeep<DocumentCategoryApi>, { documentPages: number[] }>;

export type DocumentCategoryCreate = Pick<DocumentCategory, 'title' | 'documentId'>;

export type DocumentCategoryUpdate = RequireAtLeastOne<Pick<DocumentCategory, DocumentPageRequestFields>, 'title'>;
