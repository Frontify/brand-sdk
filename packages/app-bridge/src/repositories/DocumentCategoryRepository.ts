/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, convertObjectCase } from '../utilities';
import type { DocumentCategory, DocumentCategoryApi } from '../types';

export const getDocumentCategoriesByDocumentId = async (documentId: number): Promise<DocumentCategory[]> => {
    const { result } = await HttpClient.get<DocumentCategoryApi[]>(
        `/api/document-page-category?document_id=${documentId}`,
    );

    return convertObjectCase(result.data, 'camel');
};

export const createDocumentCategory = async (category: DocumentCategory): Promise<DocumentCategory> => {
    const { result } = await HttpClient.post<DocumentCategoryApi>(
        '/api/document-page-category',
        convertObjectCase(category, 'snake'),
    );

    return convertObjectCase(result.data, 'camel');
};

export const updateDocumentCategory = async (
    category: PickRequired<Partial<DocumentCategory>, 'id'>,
): Promise<DocumentCategory> => {
    const { result } = await HttpClient.patch<DocumentCategoryApi>(
        `/api/document-page-category/${category.id}`,
        convertObjectCase(category, 'snake'),
    );

    return convertObjectCase(result.data, 'camel');
};

export const deleteDocumentCategory = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document-page-category//${id}`);

    if (!result.success) {
        throw new Error('Could not delete document page category');
    }
};
