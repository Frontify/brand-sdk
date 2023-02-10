/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, convertObjectCase } from '../utilities';
import type { DocumentCategory, DocumentCategoryApi } from '../types';

const mutateDocumentCategories = (documentCategories: DocumentCategoryApi[]): DocumentCategory[] => {
    const categories: DocumentCategory[] = [];

    for (const category of documentCategories) {
        categories.push({
            ...convertObjectCase(category, 'camel'),
            documentPages: category.document_pages?.map((page) => page.id) ?? [],
        });
    }

    return categories;
};

export const getDocumentCategoriesByDocumentId = async (documentId: number): Promise<DocumentCategory[]> => {
    const { result } = await HttpClient.get<DocumentCategoryApi[]>(
        `/api/document-page-category?document_id=${documentId}`,
    );

    return mutateDocumentCategories(result.data);
};

export const createDocumentCategory = async (category: DocumentCategory): Promise<DocumentCategory> => {
    const { result } = await HttpClient.post<DocumentCategoryApi>(
        '/api/document-page-category',
        convertObjectCase(category, 'snake'),
    );

    return {
        ...convertObjectCase(result.data, 'camel'),
        documentPages: result.data.document_pages?.map((page) => page.id) ?? [],
    };
};

export const updateDocumentCategory = async (category: DocumentCategory): Promise<DocumentCategory> => {
    const { result } = await HttpClient.patch<DocumentCategoryApi>(
        `/api/document-page-category/${category.id}`,
        convertObjectCase(category, 'snake'),
    );

    return {
        ...convertObjectCase(result.data, 'camel'),
        documentPages: result.data.document_pages?.map((page) => page.id) ?? [],
    };
};

export const deleteDocumentCategory = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document-page-category/${id}`);

    if (!result.success) {
        throw new Error('Could not delete document page category');
    }
};

export const moveDocumentCategory = async (id: number, documentId: number, position: number): Promise<void> => {
    const { result } = await HttpClient.post(`/api/document/category/${documentId}/${id}`, { sort: position });

    if (!result.success) {
        throw new Error('Could not move document category');
    }
};
