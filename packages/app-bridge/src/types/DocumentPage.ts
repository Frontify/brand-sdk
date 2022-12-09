/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, RequireAtLeastOne } from 'type-fest';

export enum DocumentPageVisibility {
    Everyone = 'EVERYONE',
    Editor = 'EDITOR',
}

/**
 * virtual fields of Document Page that wont be returned by API
 */
type DocumentPageApiVirtualFields = {
    category_id?: Nullable<number>;
};

type DocumentPageApiAsLink = {
    link_type: 'EXTERNAL';
    link_url: string;
};

type DocumentPageApiAsNoneLink = {
    link_type: 'INTERNAL';
    link_url: Nullable<never>;
};

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
    view_count: number;
    visibility: DocumentPageVisibility;
    change_processed: Nullable<string>;
    change_processed_by: Nullable<number>;
    change_skipped: Nullable<string>;
    change_skipped_by: Nullable<number>;
    change_comment: Nullable<string>;
    change_comment_by: Nullable<number>;
    change_title: Nullable<string>;
    targets?: Nullable<Record<string, unknown>>;
    category?: Nullable<Record<string, unknown>>;
    parent_document?: Nullable<Record<string, unknown>>;
    parent_portal?: Nullable<Record<string, unknown>>;
    translations?: Nullable<Record<string, unknown>>;
} & DocumentPageApiVirtualFields &
    (DocumentPageApiAsLink | DocumentPageApiAsNoneLink);

export type DocumentPage = CamelCasedPropertiesDeep<DocumentPageApi>;

type DocumentPageRequest = {
    id: number;
    title: string;
    documentId: number;
    linkUrl?: string | null;
    categoryId?: number | null;
    visibility?: DocumentPageVisibility;
};

export type DocumentPageCreate = Omit<DocumentPageRequest, 'id'>;

export type DocumentPageUpdate = RequireAtLeastOne<
    DocumentPageRequest,
    'categoryId' | 'documentId' | 'linkUrl' | 'title' | 'visibility'
>;
