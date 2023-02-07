/* (c) Copyright Frontify Ltd., all rights reserved. */

import cloneDeep from 'lodash-es/cloneDeep';
import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, EmitterAction } from '../types';

type DocumentCategoryEvent = {
    action: EmitterAction;
    documentCategory: DocumentCategory | { id: number };
};

type DocumentPageEvent = {
    action: EmitterAction;
    documentPage: { id: number; categoryId?: number | null };
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
        const handleEventUpdates = (event: DocumentCategoryEvent) => {
            setDocumentCategories((previousState) => {
                const handler = actionHandlers[event.action] || actionHandlers.default;

                return handler(previousState, event.documentCategory as DocumentCategory);
            });
        };

        const handlePageEventUpdates = (event: DocumentPageEvent) => {
            setDocumentCategories((previousState) => {
                const action: 'add-page' | 'delete-page' | 'update-page' = `${event.action}-page`;

                const handler = actionHandlers[action] || actionHandlers.default;

                return handler(previousState, event.documentPage);
            });
        };

        window.emitter.on(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, handleEventUpdates);
        window.emitter.on(`AppBridge:GuidelineDocumentCategoryPageAction:${documentId}`, handlePageEventUpdates);

        return () => {
            window.emitter.off(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, handleEventUpdates);
            window.emitter.off(`AppBridge:GuidelineDocumentCategoryPageAction:${documentId}`, handlePageEventUpdates);
        };
    }, [documentId]);

    return { documentCategories, refetch };
};

const getCategoryWithPage = (categories: Map<number, DocumentCategory>, pageId: number) =>
    Array.from(categories.values()).find((category) => category.documentPages?.includes(pageId as any));

const addPage = (categories: Map<number, DocumentCategory>, pageToAdd: DocumentPageEvent['documentPage']) => {
    const category = categories.get(pageToAdd.categoryId as number);

    if (!category) {
        console.error(`Can not add page to category, category with id ${pageToAdd.categoryId} does not exist`);
        return categories;
    }

    category.documentPages = [...((category.documentPages ?? []) as any), pageToAdd.id];

    return new Map(categories.set(category.id, category));
};

const updatePage = (categories: Map<number, DocumentCategory>, page: DocumentPageEvent['documentPage']) => {
    const currentCategory = getCategoryWithPage(categories, page.id);
    let updatedCategories = new Map(categories);

    const shouldAddPageToCategory = !currentCategory && page.categoryId !== null;

    const pageMovedToDifferentCategory =
        currentCategory && page.categoryId !== null && currentCategory.id !== page.categoryId;

    const pageMovedToUncategorized = currentCategory && page.categoryId === null;

    if (pageMovedToDifferentCategory || pageMovedToUncategorized) {
        updatedCategories = deletePage(categories, page);
    }

    if (pageMovedToDifferentCategory || shouldAddPageToCategory) {
        updatedCategories = addPage(categories, page);
    }

    return updatedCategories;
};

const deletePage = (categories: Map<number, DocumentCategory>, pageToDelete: DocumentPageEvent['documentPage']) => {
    const category = getCategoryWithPage(categories, pageToDelete.id);

    if (!category) {
        console.error(
            `Can not delete page from category, category that has page with id ${pageToDelete.id} does not exist`,
        );
        return categories;
    }

    category.documentPages =
        category.documentPages?.filter((pageId) => (pageId as unknown as any) !== pageToDelete.id) ?? [];

    return new Map(categories.set(category.id, category));
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

    'add-page': addPage,

    'update-page': updatePage,

    'delete-page': deletePage,

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
