/* (c) Copyright Frontify Ltd., all rights reserved. */

export type DocumentCategory = {
    id: number;
    documentId: number;
    slug: string;
    title: string;
    sort: number;
    creator: number;
    created: string;
    modifier: Nullable<string>;
    modified: Nullable<string>;
    validFrom: string;
    validTo: Nullable<string>;
    numberOfDocumentPages: number;
};
