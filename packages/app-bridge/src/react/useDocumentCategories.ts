/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, EmitterAction, EmitterEvents } from '../types';

type DocumentPageEvent = {
    action: EmitterAction;
    documentPage: { id: number; categoryId?: number | null };
};

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocumentCategories = (a: DocumentCategory, b: DocumentCategory) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentCategories = (
    appBridge: AppBridgeBlock | AppBridgeTheme,
    documentId: number,
    options: Options = { enabled: true },
) => {
    const [documentCategories, setDocumentCategories] = useState<Map<number, DocumentCategory>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setDocumentCategories(await fetchDocumentCategories(appBridge, documentId));
        setIsLoading(false);
    }, [appBridge, documentId]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [refetch, options.enabled]);

    useEffect(() => {
        const handlePageEventUpdates = (event: EmitterEvents['AppBridge:GuidelineDocumentCategoryPageAction']) => {
            if (event.documentPage.documentId !== documentId) {
                return;
            }

            setDocumentCategories((previousState) => {
                const action = `${event.action}-page` as const;

                const handler = actionHandlers[action] || actionHandlers.default;

                return handler(previousState, event.documentPage);
            });
        };

        const handler = ({ action, documentCategory }: EmitterEvents['AppBridge:GuidelineDocumentCategoryAction']) => {
            if (
                documentCategory.documentId === documentId &&
                (documentCategories.has(documentCategory.id) || action === 'add')
            ) {
                refetch();
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentCategoryAction', handler);
        window.emitter.on('AppBridge:GuidelineDocumentCategoryPageAction', handlePageEventUpdates);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentCategoryAction', handler);
            window.emitter.off('AppBridge:GuidelineDocumentCategoryPageAction', handlePageEventUpdates);
        };
    }, [documentCategories, documentId, refetch]);

    return { documentCategories: Array.from(documentCategories.values()), refetch, isLoading };
};

const addDocumentPage = (
    documentCategories: Map<number, DocumentCategory>,
    documentPageToAdd: DocumentPageEvent['documentPage'],
) => {
    if (!documentPageToAdd.categoryId) {
        return documentCategories;
    }

    const documentCategory = documentCategories.get(documentPageToAdd.categoryId);
    if (!documentCategory) {
        return documentCategories;
    }

    documentCategory.numberOfDocumentPages += 1;

    return documentCategories.set(documentCategory.id, documentCategory);
};

const deleteDocumentPage = (
    documentCategories: Map<number, DocumentCategory>,
    documentPageToDelete: DocumentPageEvent['documentPage'],
) => {
    if (!documentPageToDelete.categoryId) {
        return documentCategories;
    }

    const documentCategory = documentCategories.get(documentPageToDelete.categoryId);
    if (!documentCategory) {
        return documentCategories;
    }

    documentCategory.numberOfDocumentPages -= 1;

    return documentCategories.set(documentCategory.id, documentCategory);
};

const actionHandlers = {
    'add-page': addDocumentPage,
    'delete-page': deleteDocumentPage,
    default: (documentCategories: Map<number, DocumentCategory>) => documentCategories,
};

const fetchDocumentCategories = async (appBridge: AppBridgeBlock | AppBridgeTheme, documentId: number) => {
    const categories = await appBridge.getDocumentCategoriesByDocumentId(documentId);

    return new Map(categories.sort(sortDocumentCategories).map((category) => [category.id, category]));
};
