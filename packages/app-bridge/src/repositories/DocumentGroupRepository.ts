/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RequireExactlyOne } from 'type-fest';
import type { DocumentGroup, DocumentGroupApi } from '../types';
import { HttpClient, convertObjectCase } from '../utilities';

const mutateDocumentGroups = (documentGroups: DocumentGroupApi[]): DocumentGroup[] => {
    const groups: DocumentGroup[] = [];

    for (const group of documentGroups) {
        groups.push({
            ...convertObjectCase(group, 'camel'),
            documents: group.documents?.map((document) => document.id) ?? [],
        });
    }

    return groups;
};

export const getDocumentGroupsByPortalId = async (portalId: number, language = ''): Promise<DocumentGroup[]> => {
    const languageQuery = language.length > 0 ? `&language=${language}` : '';

    const { result } = await HttpClient.get<DocumentGroupApi[]>(
        `/api/document-group?portal_id=${portalId}${languageQuery}`,
    );

    return mutateDocumentGroups(result.data);
};

export const createDocumentGroup = async (documentGroup: DocumentGroup): Promise<DocumentGroup> => {
    const { result } = await HttpClient.post<DocumentGroupApi>(
        '/api/document-group',
        convertObjectCase(documentGroup, 'snake'),
    );
    return {
        ...convertObjectCase(result.data, 'camel'),
        documents: result.data.documents?.map((document) => document.id) ?? [],
    };
};

export const updateDocumentGroup = async (
    documentGroup: RequireExactlyOne<DocumentGroup, 'id'>,
    language = '',
): Promise<DocumentGroup> => {
    const { result } = await HttpClient.put<DocumentGroupApi>(`/api/document-group/${documentGroup.id}`, {
        ...convertObjectCase(documentGroup, 'snake'),
        ...(language && { language }),
    });

    return {
        ...convertObjectCase(result.data, 'camel'),
        documents: result.data.documents?.map((document) => document.id) ?? [],
    };
};

export const deleteDocumentGroup = async (id: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/document-group/${id}`);

    if (!result.success) {
        throw new Error('Could not delete document group');
    }
};

export const moveDocumentGroup = async (id: number, portalId: number, position: number): Promise<DocumentGroup> => {
    const { result } = await HttpClient.put(`/api/document-group/sorting/${id}`, {
        portalId,
        position,
    });

    return convertObjectCase(result.data, 'camel') as DocumentGroup;
};
