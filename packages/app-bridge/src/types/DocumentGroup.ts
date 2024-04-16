/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CamelCasedPropertiesDeep } from 'type-fest';

export type DocumentGroupApi = {
    id: number;
    name: string;
    sort: Nullable<number>;
    creator: number;
    created: string;
    modified: Nullable<string>;
    modifier: Nullable<number>;
    valid_to: Nullable<string>;
    project_id: number;
    portal_id: number;
    number_of_documents: number;
};

export type DocumentGroup = CamelCasedPropertiesDeep<DocumentGroupApi>;

export type DocumentGroupCreate = Pick<DocumentGroup, 'name'>;
export type DocumentGroupUpdate = Pick<DocumentGroup, 'name' | 'id'>;
export type DocumentGroupDelete = Pick<DocumentGroup, 'id'>;
