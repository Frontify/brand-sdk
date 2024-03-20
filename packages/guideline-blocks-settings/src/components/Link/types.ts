/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentSection } from '@frontify/app-bridge';

export type InitiallyExpandedItems = {
    documentId?: number;
    pageId?: number;
};

export type DocumentSectionWithTitle = Omit<DocumentSection, 'title'> & { title: string };
