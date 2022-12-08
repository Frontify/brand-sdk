/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep } from 'type-fest';

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

export type DocumentGroupValidFields = 'name' | 'projectId' | 'portalId' | 'id';

export type DocumentGroup = CamelCasedPropertiesDeep<DocumentGroupApi>;

export type ValidDocumentGroup = Pick<DocumentGroup, DocumentGroupValidFields>;
