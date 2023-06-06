/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, RequireAtLeastOne, SetRequired } from 'type-fest';

import { LinkType } from './Document';
import { SingleTargetApi } from './Targets';

export enum DocumentPageVisibility {
    Everyone = 'EVERYONE',
    Editor = 'EDITOR',
}

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
    targets: Nullable<SingleTargetApi['target'][]>;
    category?: Nullable<Record<string, unknown>>;
    parent_document?: Nullable<Record<string, unknown>>;
    parent_portal?: Nullable<Record<string, unknown>>;
    translations?: Nullable<Record<string, unknown>>;
    permanent_link: string;
} & (DocumentPageApiAsLink | DocumentPageApiAsNoneLink);

export type DocumentPage = CamelCasedPropertiesDeep<DocumentPageApi>;

type DocumentPageRequest = {
    id: number;
    title: Nullable<string>;
    documentId: number;
    linkUrl?: Nullable<string>;
    categoryId?: Nullable<number>;
    visibility?: DocumentPageVisibility;
};

export type DocumentPageCreate = Omit<SetRequired<DocumentPageRequest, 'title' | 'documentId'>, 'id'>;

export type DocumentPageUpdate = RequireAtLeastOne<
    DocumentPageRequest,
    'documentId' | 'categoryId' | 'linkUrl' | 'title' | 'visibility'
>;

export type DocumentPageDelete = Pick<DocumentPageRequest, 'id' | 'documentId' | 'categoryId'>;

export type DocumentPageDuplicateApi = {
    page: {
        id: number;
        link_type: LinkType;
        name: string;
        sections: unknown[];
        url: string;
        visibility: DocumentPageVisibility;
    };
};

export type DocumentPageDuplicate = CamelCasedPropertiesDeep<DocumentPageDuplicateApi['page']>;
