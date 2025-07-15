/* (c) Copyright Frontify Ltd., all rights reserved. */

import { produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type DocumentCategory, type EmitterEvents } from '../types';

type DocumentPageEvent = EmitterEvents['AppBridge:GuidelineDocumentCategory:DocumentPageAction'];
type DocumentCategoryMoveEvent = EmitterEvents['AppBridge:GuidelineDocumentCategory:MoveEvent'];

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

const sortDocumentCategories = (a: DocumentCategory, b: DocumentCategory) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentCategories = (
    appBridge: AppBridgeBlock,
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
        const handleDocumentPageEvent = (
            event: EmitterEvents['AppBridge:GuidelineDocumentCategory:DocumentPageAction'],
        ) => {
            if (!documentCategories.has(event.documentPage.categoryId)) {
                return;
            }

            setDocumentCategories(
                produce((draft) => {
                    const action = `${event.action}-page` as const;
                    const handler = actionHandlers[action] || actionHandlers.default;
                    return handler(draft, event.documentPage);
                }),
            );
        };

        const handleDocumentCategoryMoveEvent = (event: DocumentCategoryMoveEvent) => {
            if (!documentCategories.has(event.documentCategory.id)) {
                return;
            }

            setDocumentCategories(
                produce((draft) => {
                    previewDocumentCategorySort(draft, event.documentCategory, event.position);
                }),
            );
        };

        const handler = ({ action, documentCategory }: EmitterEvents['AppBridge:GuidelineDocumentCategory:Action']) => {
            if (
                (action === 'update' && documentCategories.has(documentCategory.id)) ||
                (action === 'add' && documentCategory.documentId === documentId)
            ) {
                refetch();
            } else if (action === 'delete' && documentCategories.has(documentCategory.id)) {
                setDocumentCategories(
                    produce((draft) => {
                        draft.delete(documentCategory.id);
                    }),
                );
            }
        };

        window.emitter.on('AppBridge:GuidelineDocumentCategory:Action', handler);
        window.emitter.on('AppBridge:GuidelineDocumentCategory:DocumentPageAction', handleDocumentPageEvent);
        window.emitter.on('AppBridge:GuidelineDocumentCategory:MoveEvent', handleDocumentCategoryMoveEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentCategory:Action', handler);
            window.emitter.off('AppBridge:GuidelineDocumentCategory:DocumentPageAction', handleDocumentPageEvent);
            window.emitter.off('AppBridge:GuidelineDocumentCategory:MoveEvent', handleDocumentCategoryMoveEvent);
        };
    }, [documentCategories, documentId, refetch]);

    return { documentCategories: Array.from(documentCategories.values()), refetch, isLoading };
};

const previewDocumentCategorySort = (
    documentCategories: Map<number, DocumentCategory>,
    documentCategory: DocumentCategoryMoveEvent['documentCategory'],
    newPosition: DocumentCategoryMoveEvent['position'],
) => {
    if (!documentCategory.sort || !newPosition) {
        return documentCategories;
    }

    const previousCategory = documentCategories.get(documentCategory.id);
    const documentCategoriesAsArray: DocumentCategory[] = [...documentCategories.values()].sort(sortDocumentCategories);

    documentCategories.clear();

    let sort = 1;
    let isOnLastPosition = true;
    for (const currentDocumentCategory of documentCategoriesAsArray) {
        if (currentDocumentCategory.id === documentCategory.id) {
            continue;
        }

        if (previousCategory && sort === newPosition) {
            documentCategories.set(documentCategory.id, { ...previousCategory, sort: newPosition });
            isOnLastPosition = false;
        }

        documentCategories.set(currentDocumentCategory.id, {
            ...currentDocumentCategory,
            sort,
        });

        sort++;
    }

    if (previousCategory && isOnLastPosition) {
        documentCategories.set(documentCategory.id, { ...previousCategory, sort });
    }

    return documentCategories;
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

    const newDocumentCategory = {
        ...documentCategory,
        numberOfDocumentPages: documentCategory.numberOfDocumentPages + 1,
    };

    return documentCategories.set(documentCategory.id, newDocumentCategory);
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

    const newDocumentCategory = {
        ...documentCategory,
        numberOfDocumentPages: documentCategory.numberOfDocumentPages - 1,
    };

    return documentCategories.set(documentCategory.id, newDocumentCategory);
};

const actionHandlers = {
    'add-page': addDocumentPage,
    'delete-page': deleteDocumentPage,
    default: (documentCategories: Map<number, DocumentCategory>) => documentCategories,
};

const fetchDocumentCategories = async (appBridge: AppBridgeBlock, documentId: number) => {
    const categories = await appBridge.getDocumentCategoriesByDocumentId(documentId);
    return new Map([...categories].sort(sortDocumentCategories).map((category) => [category.id, category]));
};
