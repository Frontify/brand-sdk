/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep } from 'type-fest';

import type { DocumentPageApi } from './DocumentPage';

export type DocumentPageCategoryApi = {
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

export type DocumentPageCategory = CamelCasedPropertiesDeep<DocumentPageCategoryApi>;
