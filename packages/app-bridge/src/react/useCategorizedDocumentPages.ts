/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';
import { produce } from 'immer';

import type { DocumentPage, EmitterEvents } from '../types';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';

import { DocumentPageTargetEvent } from './useDocumentPageTargets';

type DocumentPagesMoveEvent = EmitterEvents['AppBridge:GuidelineDocumentPage:MoveEvent'];

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
                    break;
                }
            }
        };

        const handleDocumentPageMoveEvent = (event: DocumentPagesMoveEvent) => {
            if (!documentPages.has(event.documentPage.id)) {
                return;
            }

            setDocumentPages(
                produce((draft) => {
                    previewDocumentPagesSort(draft, event.documentPage, event.categoryId, event.position);
                }),
            );
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
                            moveDocumentPage(draft, documentPage);
                        } else if (action === 'delete') {
                            draft.delete(documentPage.id);
                        }
                    }),
                );
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentPage:Action', handler);
        window.emitter.on('AppBridge:GuidelineDocumentPageTargets:Action', refetchIfPageExistsInMap);
        window.emitter.on('AppBridge:GuidelineDocumentPage:MoveEvent', handleDocumentPageMoveEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPage:Action', handler);
            window.emitter.off('AppBridge:GuidelineDocumentPageTargets:Action', refetchIfPageExistsInMap);
            window.emitter.off('AppBridge:GuidelineDocumentPage:MoveEvent', handleDocumentPageMoveEvent);
        };
    }, [documentCategoryId, refetch, documentPages]);

    return { documentPages: Array.from(documentPages.values()), refetch, isLoading };
};

const previewDocumentPagesSort = (
    documentPages: Map<number, DocumentPage>,
    documentPage: DocumentPagesMoveEvent['documentPage'],
    categoryId: DocumentPagesMoveEvent['categoryId'],
    newPosition: DocumentPagesMoveEvent['position'],
) => {
    if (!documentPage.sort || !newPosition) {
        return documentPages;
    }

    const previousPosition = documentPage.sort;
    const documentPagesAsArray: DocumentPage[] = [...documentPages.values()];

    documentPages.clear();

    for (const currentDocumentPage of documentPagesAsArray) {
        if (currentDocumentPage.categoryId !== categoryId) {
            continue;
        }

        if (currentDocumentPage.id === documentPage.id) {
            documentPages.set(currentDocumentPage.id, { ...currentDocumentPage, sort: newPosition });
            continue;
        }

        const currentPosition = currentDocumentPage.sort ?? 0;
        let positionIncrease = 0;
        if (newPosition <= currentPosition) {
            positionIncrease = previousPosition > currentPosition || previousPosition === 0 ? 1 : 0;
        }

        documentPages.set(currentDocumentPage.id, {
            ...currentDocumentPage,
            sort: currentPosition + positionIncrease,
        });
    }

    return documentPages;
};

const moveDocumentPage = (draft: Map<number, DocumentPage>, documentPage: DocumentPage) => {
    const documentPagesAsArray: DocumentPage[] = [...draft.values()];
    let isPageOnLastPosition = true;

    draft.clear();

    for (const currentDocumentPage of documentPagesAsArray) {
        if (currentDocumentPage.id === documentPage.id) {
            continue;
        }
        if (draft.size === documentPage.sort - 1) {
            draft.set(documentPage.id, documentPage);
            isPageOnLastPosition = false;
        }

        draft.set(currentDocumentPage.id, currentDocumentPage);
    }

    if (isPageOnLastPosition) {
        draft.set(documentPage.id, documentPage);
    }

    return draft;
};

const fetchDocumentPagesByDocumentCategoryId = async (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentCategoryId: number,
) => {
    const pages = await appBridge.getDocumentPagesByDocumentCategoryId(documentCategoryId);
    return new Map([...pages].sort(sortDocumentPages).map((page) => [page.id, page]));
};
