/* (c) Copyright Frontify Ltd., all rights reserved. */

export type DocumentSectionApi = {
    id: number;
    document_id: number;
    page_id: number;
    revision: unknown;
    slug: string;
    sort: number;
    title: string;
    creator: number;
    created: string;
    modifier: Nullable<number>;
    modified: Nullable<string>;
    valid_from: string;
    valid_to: Nullable<string>;
    permanent_link: string;
};

export type DocumentSection = {
    id: number;
    title: string;
    slug: string;
    sort: number;
    permanentLink: string;
};

export type AddDocumentSectionPayload = {
    documentSection: DocumentSection;
    previousDocumentSectionId: Nullable<number>;
    documentPageId: number;
};

export type UpdateDocumentSectionPayload = {
    id: number;
    title: string;
    slug: string;
    documentPageId: number;
};

export type DeleteDocumentSectionPayload = {
    id: number;
    documentPageId: number;
};
