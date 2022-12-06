/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, convertObjectCase } from '../utilities';
import type { DocumentPageCategory, DocumentPageCategoryApi } from '../types';

export const getDocumentCategoriesByDocumentId = async (documentId: number): Promise<DocumentPageCategory[]> => {
    const { result } = await HttpClient.get<DocumentPageCategoryApi[]>(
        `/api/document-page-category?document_id=${documentId}`,
    );

    return convertObjectCase(result.data, 'camel');
};

export const createDocumentPageCategory = async (category: DocumentPageCategory): Promise<DocumentPageCategory> => {
    const { result } = await HttpClient.post<DocumentPageCategoryApi>(
        '/api/document-page-category',
        convertObjectCase(category, 'snake'),
    );

    return convertObjectCase(result.data, 'camel');
};

export const updateDocumentPageCategory = async (category: DocumentPageCategory): Promise<DocumentPageCategory> => {
    const { result } = await HttpClient.patch<DocumentPageCategoryApi>(
        `/api/document-page-category/${category.id}`,
        convertObjectCase(category, 'snake'),
    );

    return convertObjectCase(result.data, 'camel');
};

export const deleteDocumentPageCategory = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document-page-category//${id}`);

    if (!result.success) {
        throw new Error('Could not delete document page category');
    }
};
