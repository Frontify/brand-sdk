/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep, SetRequired } from 'type-fest';

import { DocumentApi } from './Document';

export type DocumentGroupApi = {
    id: number;
    name: string;
    sort: number;
    creator: number;
    created: string;
    modified: string;
    modifier: number;
    valid_to: Nullable<string>;
    project_id: number;
    portal_id: number;
    documents: Nullable<DocumentApi[]>;
};

export type DocumentGroup = CamelCasedPropertiesDeep<DocumentGroupApi>;
export type CreateDocumentGroup = Pick<DocumentGroup, 'name' | 'projectId' | 'portalId'>;
export type UpdateDocumentGroup = SetRequired<
    Partial<Pick<DocumentGroup, 'name' | 'projectId' | 'portalId' | 'id'>>,
    'id'
>;
