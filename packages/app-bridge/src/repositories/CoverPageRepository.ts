/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient, convertObjectCase } from '../utilities';
import type { CoverPage, CoverPageApi } from '../types';

export const mapToCoverPage = (coverPage: CoverPageApi): CoverPage => ({
    ...convertObjectCase(coverPage.brandhome, 'camel'),
    template: coverPage.template,
    documentId: coverPage.document_id,
    draft: Boolean(coverPage.brandhome?.draft),
    enabled: Boolean(coverPage.brandhome?.enabled),
});

const mapToCoverPageApi = (coverPage: CoverPage): CoverPageApi => ({
    template: coverPage.template,
    document_id: coverPage.documentId,
    brandhome: {
        ...convertObjectCase(coverPage, 'snake'),
        draft: Number(coverPage.draft) as CoverPageApi['brandhome']['draft'],
        enabled: Number(coverPage.enabled) as CoverPageApi['brandhome']['enabled'],
    },
});

export const createCoverPage = async (coverPage: CoverPage): Promise<CoverPage> => {
    const { result } = await HttpClient.post<CoverPageApi>('/api/brandportal', mapToCoverPageApi(coverPage));

    return mapToCoverPage({ ...result.data, brandhome: { draft: 1, enabled: 1 } as CoverPageApi['brandhome'] });
};

export const updateCoverPage = async (coverPage: CoverPage): Promise<CoverPage> => {
    const { result } = await HttpClient.patch<CoverPageApi>(
        `/api/brandportal/${coverPage.id}`,
        mapToCoverPageApi(coverPage),
    );

    return mapToCoverPage(result.data);
};

/**
 * @deprecated legacy endpoint, should be removed once new is available
 */
export const publishCoverPage = async (coverPage: { brandhome_draft: boolean; portalId: number }): Promise<unknown> => {
    const { result } = await HttpClient.post<CoverPageApi>(`/api/hub/settings/${coverPage.portalId}`, coverPage);

    return result;
};

export const getCoverPage = async (hubId: number): Promise<CoverPage> => {
    const { result } = await HttpClient.get<CoverPageApi>(`/api/document/navigation/${hubId}`);

    return mapToCoverPage(<CoverPageApi>(<unknown>result));
};

export const deleteCoverPage = async (brandPortalId: number): Promise<void> => {
    const { result } = await HttpClient.delete(`/api/brandportal/${brandPortalId}`);

    if (!result.success) {
        throw new Error('Could not delete cover page');
    }
};
