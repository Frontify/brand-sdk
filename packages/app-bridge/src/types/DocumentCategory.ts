/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, SetRequired } from 'type-fest';

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
    document_pages: DocumentPageApi[];
};

export type DocumentCategory = CamelCasedPropertiesDeep<DocumentCategoryApi>;
export type CreateDocumentCategory = Pick<DocumentCategory, 'title' | 'documentId'>;
export type UpdateDocumentCategory = SetRequired<Partial<Pick<DocumentCategory, 'title' | 'id'>>, 'id'>;
