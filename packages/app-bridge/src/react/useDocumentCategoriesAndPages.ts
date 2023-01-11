/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash-es';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, DocumentPage, EmitterAction } from '../types';

export const useDocumentCategoriesAndPages = (appBridge: AppBridgeTheme, documentId: number) => {
    const [documentCategoriesAndPages, setDocumentCategoriesAndPages] =
        useState<Nullable<(DocumentPage | DocumentCategory)[]>>(null);

    useEffect(() => {
        const fetchAllDocumentPages = async () => {
            const [allDocumentCategories = [], allDocumentsWithoutCategories = []] = await Promise.all([
                appBridge.getDocumentCategoriesByDocumentId(documentId),
                appBridge.getUncategorizedPagesByDocumentId(documentId),
            ]);

            allDocumentCategories.sort((a, b) => a.sort - b.sort);
            allDocumentsWithoutCategories.sort((a, b) => a.sort - b.sort);

            setDocumentCategoriesAndPages([...allDocumentCategories, ...allDocumentsWithoutCategories]);
        };

        fetchAllDocumentPages();
    }, [appBridge, documentId]);

    useEffect(() => {
        const updateFromEvent = (event: {
            action: EmitterAction;
            documentPageOrDocumentCategory: DocumentPage | DocumentCategory | { id: number };
        }) => {
            setDocumentCategoriesAndPages((previousState) => {
                const isInitial = previousState === null;

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add'
                        ? [event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory]
                        : previousState;
                }

                if (event.action === 'delete') {
                    return deletePage(previousState, event.documentPageOrDocumentCategory);
                }

                if (event.action === 'add') {
                    return addPage(
                        previousState,
                        event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory,
                        documentId,
                    );
                }

                if (event.action === 'update') {
                    return updatePage(
                        previousState,
                        event.documentPageOrDocumentCategory as DocumentPage | DocumentCategory,
                    );
                }

                return previousState;
            });
        };

        const updateDocumentPageFromEvent = ({
            action,
            documentPage,
        }: {
            action: EmitterAction;
            documentPage: DocumentPage | { id: number };
        }) => updateFromEvent({ action, documentPageOrDocumentCategory: documentPage });

        const updateDocumentCategoryFromEvent = ({
            action,
            documentCategory,
        }: {
            action: EmitterAction;
            documentCategory: DocumentCategory | { id: number };
        }) => updateFromEvent({ action, documentPageOrDocumentCategory: documentCategory });

        window.emitter.on('AppBridge:GuidelineDocumentPageAction', updateDocumentPageFromEvent);
        window.emitter.on('AppBridge:GuidelineDocumentCategoryAction', updateDocumentCategoryFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageAction', updateDocumentPageFromEvent);
            window.emitter.off('AppBridge:GuidelineDocumentCategoryAction', updateDocumentCategoryFromEvent);
        };
    }, [appBridge, documentId]);

    return { documentCategoriesAndPages };
};

const addPage = (
    pages: (DocumentPage | DocumentCategory)[],
    pageToAdd: DocumentPage | DocumentCategory,
    currentDocument: number,
) => {
    if (pageToAdd.documentId !== currentDocument) {
        return pages;
    }

    const pagesClone = cloneDeep(pages);

    const isPageInCategory =
        'categoryId' in pageToAdd && pageToAdd.categoryId !== null && pageToAdd.categoryId !== undefined;

    const addPageToCategory = () => {
        for (const page of pagesClone) {
            if (
                page.id === (pageToAdd as DocumentPage).categoryId &&
                page.documentId === pageToAdd.documentId &&
                'documentPages' in page
            ) {
                page.documentPages
                    ? page.documentPages.push(pageToAdd as DocumentPage)
                    : (page.documentPages = [pageToAdd as DocumentPage]);

                break;
            }
        }
    };

    isPageInCategory ? addPageToCategory() : pagesClone.push(pageToAdd);

    return pagesClone;
};

const updatePage = (
    documents: (DocumentPage | DocumentCategory)[],
    documentToUpdate: DocumentPage | DocumentCategory,
) => {
    const pagesClone = cloneDeep(documents);

    const documentToUpdateIndex = pagesClone.findIndex((document) => document.id === documentToUpdate.id);

    pagesClone[documentToUpdateIndex] = documentToUpdate;

    return pagesClone;
};

const deletePage = (pages: (DocumentPage | DocumentCategory)[], pageToDelete: { id: number }) => {
    const filteredPages = pages.filter((page) => page.id !== pageToDelete.id);

    return filteredPages.map((page) => {
        if ('documentPages' in page) {
            page.documentPages = deletePage(page.documentPages, pageToDelete) as DocumentPage[];
        }

        return page;
    });
};
