/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';

import type { DocumentPage, EmitterEvents } from '../types';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';

import { moveInArray } from '../utilities';

import { DocumentPageTargetEvent } from './useDocumentPageTargets';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocumentPages = (a: DocumentPage, b: DocumentPage) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useCategorizedDocumentPages = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentCategoryId: number,
    options: Options = { enabled: true },
) => {
    const [documentPages, setDocumentPages] = useState<Map<number, DocumentPage>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocumentPages(await fetchDocumentPagesByDocumentCategoryId(appBridge, documentCategoryId));
        setIsLoading(false);
    }, [appBridge, documentCategoryId]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const refetchIfPageExistsInMap = (event: DocumentPageTargetEvent) => {
            for (const id of event.payload.pageIds) {
                if (documentPages.has(id)) {
                    refetch();
                }
            }
        };

        const handler = ({ action, documentPage }: EmitterEvents['AppBridge:GuidelineDocumentPage:Action']) => {
            if (
                (action === 'update' && documentPages.has(documentPage.id)) ||
                (action === 'add' && documentPage.categoryId === documentCategoryId)
            ) {
                refetch();
            } else if ((action === 'delete' || action === 'move') && documentPages.has(documentPage.id)) {
                setDocumentPages(
                    produce((draft) => {
                        if (action === 'move') {
                            const documentPagesAsArray: DocumentPage[] = [...draft.values()];

                            const originalIndex = documentPagesAsArray.findIndex((dP) => dP.id === documentPage.id);
                            if (originalIndex === -1) {
                                return console.log('originalIndex not found');
                            }

                            const updatedDocumentPages = moveInArray(
                                documentPagesAsArray,
                                originalIndex,
                                documentPage.sort - 1,
                            );

                            draft.clear();
                            for (const documentPage of updatedDocumentPages) {
                                draft.set(documentPage.id, documentPage);
                            }
                        } else if (action === 'delete') {
                            draft.delete(documentPage.id);
                        }
                    }),
                );
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentPage:Action', handler);
        window.emitter.on('AppBridge:GuidelineDocumentPageTargets:Action', refetchIfPageExistsInMap);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPage:Action', handler);
            window.emitter.off('AppBridge:GuidelineDocumentPageTargets:Action', refetchIfPageExistsInMap);
        };
    }, [documentCategoryId, refetch, documentPages]);

    return { documentPages: Array.from(documentPages.values()), refetch, isLoading };
};

const fetchDocumentPagesByDocumentCategoryId = async (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentCategoryId: number,
) => {
    const pages = await appBridge.getDocumentPagesByDocumentCategoryId(documentCategoryId);
    return new Map(pages.sort(sortDocumentPages).map((page) => [page.id, page]));
};
