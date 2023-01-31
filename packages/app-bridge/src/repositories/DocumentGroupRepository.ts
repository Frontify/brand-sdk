/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RequireExactlyOne } from 'type-fest';
import type { DocumentGroup, DocumentGroupApi } from '../types';
import { HttpClient, convertObjectCase } from '../utilities';

export const getDocumentGroupsByPortalId = async (portalId: number): Promise<DocumentGroup[]> => {
    const { result } = await HttpClient.get<DocumentGroupApi[]>(`/api/document-group?portal_id=${portalId}`);
    return convertObjectCase(result.data, 'camel');
};

export const createDocumentGroup = async (documentGroup: DocumentGroup) => {
    const { result } = await HttpClient.post<DocumentGroupApi>(
        '/api/document-group',
        convertObjectCase(documentGroup, 'snake'),
    );
    return convertObjectCase(result.data, 'camel');
};

export const updateDocumentGroup = async (
    documentGroup: RequireExactlyOne<DocumentGroup, 'id'>,
): Promise<DocumentGroup> => {
    const { result } = await HttpClient.put<DocumentGroupApi>(
        `/api/document-group/${documentGroup.id}`,
        convertObjectCase(documentGroup, 'snake'),
    );

    return convertObjectCase(result.data, 'camel');
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
