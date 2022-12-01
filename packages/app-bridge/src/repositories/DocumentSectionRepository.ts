/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentSection, DocumentSectionApi } from '../types';
import { HttpClient } from '../utilities';

export const getDocumentSectionsByDocumentPageId = async (documentPageId: number): Promise<DocumentSection[]> => {
    const { result } = await HttpClient.get<DocumentSectionApi[]>(
        `/api/document-section/?document_page_id=${documentPageId}`,
    );

    return result.data.map(mapDocumentSectionApiToDocumentSection);
};

const mapDocumentSectionApiToDocumentSection = (documentSectionApi: DocumentSectionApi): DocumentSection => ({
    id: documentSectionApi.id,
    title: documentSectionApi.title,
    slug: documentSectionApi.slug,
    sort: documentSectionApi.sort,
});
