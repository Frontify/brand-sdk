/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentPageCategory, DocumentPage, EmitterAction } from '../types';

export const useDocumentPages = (appBridge: AppBridgeTheme, documentId: number) => {
    const [documentPages, setDocumentPages] = useState<Nullable<(DocumentPage | DocumentPageCategory)[]>>(null);

    useEffect(() => {
        const fetchAllDocumentPages = async () => {
            const [allDocumentCategories, allDocumentsWithoutCategories] = await Promise.all([
                appBridge.getDocumentCategoriesByDocumentId(documentId),
                appBridge.getUncategorizedPagesByDocumentId(documentId),
            ]);

            allDocumentCategories.sort((a, b) => a.sort - b.sort);
            allDocumentsWithoutCategories.sort((a, b) => a.sort - b.sort);

            setDocumentPages([...allDocumentCategories, ...allDocumentsWithoutCategories]);
        };

        fetchAllDocumentPages();
    }, [appBridge, documentId]);

    useEffect(() => {
        const updatePageFromEvent = (event: { page: DocumentPage; action: EmitterAction }) => {
            setDocumentPages((previousState) => {
                if (event.action === 'add') {
                    return previousState ? [...cloneDeep(previousState), event.page] : [event.page];
                }

                if (event.action === 'delete') {
                    return previousState
                        ? cloneDeep(previousState).filter((page) => page.id !== event.page.id)
                        : previousState;
                }

                const pageToUpdateIndex = previousState?.findIndex((page) => page.id === event.page.id);

                if (!pageToUpdateIndex || previousState === null) {
                    return previousState;
                }

                const stateClone = cloneDeep(previousState);

                stateClone[pageToUpdateIndex] = event.page;

                return stateClone;
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentPageUpdate', updatePageFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageUpdate', updatePageFromEvent);
        };
    }, [appBridge]);

    return [documentPages];
};
