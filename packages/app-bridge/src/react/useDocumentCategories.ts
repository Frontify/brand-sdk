/* (c) Copyright Frontify Ltd., all rights reserved. */

import cloneDeep from 'lodash-es/cloneDeep';
import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, EmitterAction } from '../types';

type Event = {
    action: EmitterAction;
    documentCategory: DocumentCategory | { id: number };
};

export const useDocumentCategories = (appBridge: AppBridgeTheme, documentId: number) => {
    const [documentCategories, setDocumentCategories] = useState<Map<number, DocumentCategory>>(new Map([]));

    const refetch = useCallback(async () => {
        const pages = await fetchDocumentCategories(appBridge, documentId);

        setDocumentCategories(pages);
    }, [appBridge, documentId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleEventUpdates = (event: Event) => {
            setDocumentCategories((previousState) => {
                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event.documentCategory as DocumentCategory);
            });
        };

        window.emitter.on(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, handleEventUpdates);

        return () => {
            window.emitter.off(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, handleEventUpdates);
        };
    }, [documentId]);

    return { documentCategories, refetch };
};

const actionHandlers = {
    add: (categories: Map<number, DocumentCategory>, categoryToAdd: DocumentCategory) =>
        new Map(categories.set(categoryToAdd.id, categoryToAdd)),

    update: (categories: Map<number, DocumentCategory>, categoryToUpdate: DocumentCategory) => {
        const category = categories.get(categoryToUpdate.id);

        return new Map(categories.set(categoryToUpdate.id, { ...category, ...categoryToUpdate }));
    },

    delete: (categories: Map<number, DocumentCategory>, categoryToDelete: DocumentCategory) => {
        const nextCategories = new Map(categories);
        nextCategories.delete(categoryToDelete.id);
        return nextCategories;
    },

    default: (categories: Map<number, DocumentCategory>) => categories,
};

const fetchDocumentCategories = async (appBridge: AppBridgeTheme, documentId: number) => {
    const categories = await appBridge.getDocumentCategoriesByDocumentId(documentId);

    return convertToCategoriesMap(categories);
};

const convertToCategoriesMap = (documentCategories: DocumentCategory[]) => {
    const categoriesClone: DocumentCategory[] = cloneDeep(documentCategories);

    for (const category of categoriesClone) {
        if (!category.documentPages) {
            continue;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category.documentPages = category.documentPages.map((page) => page.id) as any;
    }

    return new Map(categoriesClone.map((category) => [category.id, category]));
};
