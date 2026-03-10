/* (c) Copyright Frontify Ltd., all rights reserved. */

export type DocumentGroup = {
    id: number;
    name: string;
    sort: Nullable<number>;
    creator: number;
    created: string;
    modified: Nullable<string>;
    modifier: Nullable<number>;
    validTo: Nullable<string>;
    projectId: number;
    portalId: number;
    numberOfDocuments: number;
};
