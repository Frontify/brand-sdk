/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentCategory, DocumentCategoryApi } from '../types';
import { HttpClient, convertObjectCase } from '../utilities';

export const getDocumentCategoriesByDocumentId = async (documentId: number): Promise<DocumentCategory[]> => {
    const { result } = await HttpClient.get<DocumentCategoryApi[]>(
        `/api/document-page-category?document_id=${documentId}`,
    );

    return convertObjectCase(result.data, 'camel');
};

export const deleteDocumentCategory = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document-page-category//${id}`);

    if (!result.success) {
        throw new Error('Could not delete document page category');
    }
};
