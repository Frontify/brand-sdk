/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, RequireAtLeastOne } from 'type-fest';

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
    number_of_document_pages: number;
};

type DocumentPageRequestFields = 'title' | 'documentId' | 'id';

export type DocumentCategory = CamelCasedPropertiesDeep<DocumentCategoryApi>;

export type DocumentCategoryCreate = Pick<DocumentCategory, 'title' | 'documentId'>;

export type DocumentCategoryUpdate = RequireAtLeastOne<Pick<DocumentCategory, DocumentPageRequestFields>, 'title'>;

export type DocumentCategoryDelete = Pick<DocumentCategory, 'id' | 'documentId'>;
