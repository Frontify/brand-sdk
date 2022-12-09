/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import cloneDeep from 'lodash-es/cloneDeep';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { DocumentCategory, DocumentPage, EmitterAction } from '../types';

export const useDocumentPages = (appBridge: AppBridgeTheme, documentId: number) => {
    const [documentPages, setDocumentPages] = useState<Nullable<(DocumentPage | DocumentCategory)[]>>(null);

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
        const updatePageFromEvent = (event: { page: DocumentPage | DocumentCategory; action: EmitterAction }) => {
            setDocumentPages((previousState) => {
                const isInitial = previousState === null;

                if (isInitial) {
                    return event.action === 'update' || event.action === 'add' ? [event.page] : previousState;
                }

                if (event.action === 'delete') {
                    return deletePage(previousState, event.page);
                }

                if (event.action === 'add') {
                    return addPage(previousState, event.page, documentId);
                }

                if (event.action === 'update') {
                    return updatePage(previousState, event.page);
                }

                return previousState;
            });
        };

        window.emitter.on('AppBridge:GuidelineDocumentPageUpdate', updatePageFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentPageUpdate', updatePageFromEvent);
        };
    }, [appBridge, documentId]);

    return [documentPages];
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
    const pagesClone = cloneDeep(pages);

    for (const [index, page] of pages.entries()) {
        if (page.id === pageToDelete.id) {
            delete pagesClone[index];

            break;
        } else if ('documentPages' in page && page.documentPages.some((page) => page.id === pageToDelete.id)) {
            const index = page.documentPages.findIndex((page) => page.id === pageToDelete.id);

            delete (pagesClone[index] as DocumentCategory).documentPages[index];

            break;
        }
    }

    pagesClone.map((page) => {
        if (page !== undefined && 'documentPages' in page) {
            page.documentPages.map((page) => page !== undefined);
        }

        return page !== undefined;
    });

    return pagesClone;
};
