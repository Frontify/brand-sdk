/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, convertObjectCase } from '../utilities';
import type { Document, DocumentApi } from '../types';

export const getDocumentsWithoutDocumentGroupByProjectId = async (portalId: number): Promise<Document[]> => {
    const { result } = await HttpClient.get<DocumentApi[]>(
        `/api/document?portal_id=${portalId}&exclude_grouped_documents`,
    );
    return convertObjectCase(result.data, 'camel');
};

export const createDocument = async <D extends Document>(document: D): Promise<Document> => {
    const { result } = await HttpClient.post<DocumentApi>('/api/document', convertObjectCase(document, 'snake'));

    return convertObjectCase(result.data, 'camel') as D;
};

export const updateDocument = async <D extends Document>(document: D): Promise<Document> => {
    const { result } = await HttpClient.patch<DocumentApi>(
        `/api/document/${document.id}`,
        convertObjectCase(document, 'snake'),
    );

    return convertObjectCase(result.data, 'camel') as D;
};

export const deleteDocument = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document/${id}`);

    if (!result.success) {
        throw new Error('Could not delete document');
    }
};
