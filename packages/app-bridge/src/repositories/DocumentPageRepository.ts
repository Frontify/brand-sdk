/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, convertObjectCase } from '../utilities';
import type { DocumentPage, DocumentPageApi, DocumentPageDuplicate, DocumentPageDuplicateApi } from '../types';

export const getDocumentPagesByDocumentId = async (documentId: number): Promise<DocumentPage[]> => {
    const { result } = await HttpClient.get<DocumentPageApi[]>(`/api/document-page?document_id=${documentId}`);
    return convertObjectCase(result.data, 'camel');
};

export const getUncategorizedPagesByDocumentId = async (documentId: number): Promise<DocumentPage[]> => {
    const { result } = await HttpClient.get<DocumentPageApi[]>(
        `/api/document-page?document_id=${documentId}&exclude_categorized`,
    );
    return convertObjectCase(result.data, 'camel');
};

export const createDocumentPage = async (page: DocumentPage) => {
    const { result } = await HttpClient.post<DocumentPageApi>('/api/document-page', convertObjectCase(page, 'snake'));
    return convertObjectCase(result.data, 'camel');
};

export const updateDocumentPage = async (page: DocumentPage): Promise<DocumentPage> => {
    const { result } = await HttpClient.patch<DocumentPageApi>(
        `/api/document-page/${page.id}`,
        convertObjectCase(page, 'snake'),
    );

    return convertObjectCase(result.data, 'camel');
};

export const deleteDocumentPage = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document-page/${id}`);

    if (!result.success) {
        throw new Error('Could not delete document page');
    }
};

// Possibly rename to moveDocumentPageWithinDocument
export const moveDocumentPage = async (
    id: number,
    documentId: number,
    position: number,
    category?: number,
): Promise<void> => {
    const { result } = await HttpClient.post(`/api/document/page/${documentId}/${id}`, { sort: position, category });

    if (!result.success) {
        throw new Error('Could not move document page');
    }
};

export const moveDocumentPageBetweenDocuments = async (
    id: number,
    sourceDocumentId: number,
    targetDocumentId: number,
): Promise<void> => {
    const { result } = await HttpClient.patch(`/api/document/page/${sourceDocumentId}`, {
        page: id,
        document: targetDocumentId,
    });

    if (!result.success) {
        throw new Error('Could not move document page');
    }
};

export const duplicateDocumentPage = async (id: number): Promise<DocumentPageDuplicate> => {
    const { result } = await HttpClient.post('/api/pages/copy', {
        page_id: id,
    });

    return convertObjectCase((result as unknown as DocumentPageDuplicateApi).page, 'camel');
};
