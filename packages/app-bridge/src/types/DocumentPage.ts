/* (c) Copyright Frontify Ltd., all rights reserved. */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { CamelCasedPropertiesDeep, SetRequired } from 'type-fest';

export enum DocumentPageVisibility {
    Everyone = 'EVERYONE',
    Editor = 'EDITOR',
}

export type DocumentPageApi = {
    id: number;
    creator: number;
    created: string;
    modifier: Nullable<number>;
    modified: Nullable<string>;
    document_id: number;
    category_id: Nullable<number>;
    parent_id: Nullable<number>;
    valid_from: string;
    valid_to: Nullable<string>;
    title: string;
    slug: string;
    sort: number;
    link_type: string;
    link_url: Nullable<string>;
    view_count: number;
    visibility: DocumentPageVisibility;
    change_processed?: any;
    change_processed_by?: any;
    change_skipped?: any;
    change_skipped_by?: any;
    change_comment?: any;
    change_comment_by?: any;
    change_title?: any;
    targets?: any;
    category?: any;
    parent_document?: any;
    parent_portal?: any;
};

export type DocumentPage = CamelCasedPropertiesDeep<DocumentPageApi>;
export type CreateDocumentPage = Pick<DocumentPage, 'title' | 'documentId' | 'categoryId'>;
export type UpdateDocumentPage = SetRequired<
    Partial<Pick<DocumentPage, 'title' | 'documentId' | 'visibility' | 'id' | 'categoryId'>>,
    'id'
>;
