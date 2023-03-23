/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeBase } from '../AppBridgeBase';
import type { DocumentCategory, EmitterAction } from '../types';

type DocumentPageEvent = {
    action: EmitterAction;
    documentPage: { id: number; categoryId?: number | null };
};

const sortDocumentCategories = (a: DocumentCategory, b: DocumentCategory) => (a.sort && b.sort ? a.sort - b.sort : 0);

export const useDocumentCategories = (appBridge: AppBridgeBase, documentId: number) => {
    const [documentCategories, setDocumentCategories] = useState<Map<number, DocumentCategory>>(new Map([]));
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        const pages = await fetchDocumentCategories(appBridge, documentId);

        setDocumentCategories(pages);
        setIsLoading(false);
    }, [appBridge, documentId]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handlePageEventUpdates = (event: DocumentPageEvent) => {
            setDocumentCategories((previousState) => {
                const action: 'add-page' | 'delete-page' | 'update-page' = `${event.action}-page`;

                const handler = actionHandlers[action] || actionHandlers.default;

                return handler(previousState, event.documentPage);
            });
        };

        window.emitter.on(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, refetch);
        window.emitter.on(`AppBridge:GuidelineDocumentCategoryPageAction:${documentId}`, handlePageEventUpdates);

        return () => {
            window.emitter.off(`AppBridge:GuidelineDocumentCategoryAction:${documentId}`, refetch);
            window.emitter.off(`AppBridge:GuidelineDocumentCategoryPageAction:${documentId}`, handlePageEventUpdates);
        };
    }, [documentId, refetch]);

    /**
     * Returns a sorted list of document categories.
     *
     * The returned list is sorted based on the `sortBy` option provided. By default, it uses the `sort` property to sort the list.
     *
     * @param options An object with the following properties:
     *   - sortBy: (optional) A function used to sort the list of document categories. It should take two document category objects as arguments and return a value that represents their sort order.
     *
     * @returns An array of sorted document categories.
     */
    const getSortedCategories = useCallback(
        (
            options: { sortBy?: (a: DocumentCategory, b: DocumentCategory) => any } = {
                sortBy: sortDocumentCategories,
            },
        ) => Array.from(documentCategories.values()).sort(options.sortBy),
        [documentCategories],
    );

    return { documentCategories, getSortedCategories, refetch, isLoading };
};

const getCategoryWithPage = (categories: Map<number, DocumentCategory>, pageId: number) =>
    Array.from(categories.values()).find((category) => category.documentPages?.includes(pageId));

const addPage = (categories: Map<number, DocumentCategory>, pageToAdd: DocumentPageEvent['documentPage']) => {
    const category = categories.get(pageToAdd.categoryId as number);

    if (!category) {
        console.error(`Can not add page to category, category with id ${pageToAdd.categoryId} does not exist`);
        return categories;
    }

    category.documentPages = [pageToAdd.id, ...category.documentPages];

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

    category.documentPages = category.documentPages?.filter((pageId) => pageId !== pageToDelete.id);

    return new Map(categories.set(category.id, category));
};

const actionHandlers = {
    'add-page': addPage,

    'update-page': updatePage,

    'delete-page': deletePage,

    default: (categories: Map<number, DocumentCategory>) => categories,
};

const fetchDocumentCategories = async (appBridge: AppBridgeBase, documentId: number) => {
    const categories = await appBridge.getDocumentCategoriesByDocumentId(documentId);

    return new Map(categories.map((category) => [category.id, category]));
};
