/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    DocumentPageTargets,
    DocumentPageTargetsApi,
    DocumentTargets,
    DocumentTargetsApi,
    TargetsUpdate,
    TargetsUpdateApi,
} from '../types';
import { HttpClient, convertObjectCase } from '../utilities';

export const mapToDocumentTargets = (targets: DocumentTargetsApi): DocumentTargets =>
    convertObjectCase(targets.targets, 'camel');
export const mapToDocumentPageTargets = (targets: DocumentPageTargetsApi): DocumentPageTargets =>
    convertObjectCase(targets, 'camel');

export const getDocumentTargets = async (id: number): Promise<DocumentTargets> => {
    const { result } = await HttpClient.get<DocumentTargetsApi>(`/api/document/appearance/${id}`);

    return mapToDocumentTargets(result as unknown as DocumentTargetsApi);
};

export const updateDocumentTargets = async (targetIds: number[], documentIds: number[]): Promise<TargetsUpdate> => {
    const { result } = await HttpClient.post<TargetsUpdateApi>('/api/target/bytype', {
        data: targetIds,
        ids: documentIds,
        type: 'document',
    });

    return result.data;
};

export const getDocumentPageTargets = async (id: number): Promise<DocumentPageTargets> => {
    const { result } = await HttpClient.get<DocumentPageTargetsApi>(`/api/target/bytype?type=documentpage&ids[]=${id}`);

    return mapToDocumentPageTargets(result as unknown as DocumentPageTargetsApi);
};

export const updateDocumentPageTargets = async (targetIds: number[], documentIds: number[]): Promise<TargetsUpdate> => {
    const { result } = await HttpClient.post<TargetsUpdateApi>('/api/target/bytype', {
        data: targetIds,
        ids: documentIds,
        type: 'documentpage',
    });

    return result.data;
};
