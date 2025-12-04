/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentPage, type DocumentSection } from '@frontify/app-bridge';
import { type ReactElement, useEffect, useState } from 'react';

import { type InitiallyExpandedItems } from '../types';

import { LoadingIndicator } from './LoadingIndicator';
import { PageLink } from './PageLink';

type PageLinksProps = {
    documentId: number;
    selectedUrl: string;
    onSelectUrl: (url: string) => void;
    itemsToExpandInitially: InitiallyExpandedItems;
    getDocumentSectionsByDocumentPageId: (documentPageId: number) => Promise<DocumentSection[]>;
    getDocumentPagesByDocumentId: (documentId: number) => Promise<DocumentPage[]>;
};

export const PageLinks = ({
    documentId,
    selectedUrl,
    onSelectUrl,
    itemsToExpandInitially,
    getDocumentSectionsByDocumentPageId,
    getDocumentPagesByDocumentId,
}: PageLinksProps): ReactElement => {
    const [pages, setPages] = useState<DocumentPage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pagesArray = [...pages.values()];
    const hasPages = !isLoading && pagesArray.length > 0;

    useEffect(() => {
        getDocumentPagesByDocumentId(documentId)
            .then((_pages) => {
                const pagesWithCategories = _pages
                    .filter((page) => !!page.category)
                    .sort((a, b) =>
                        a.category.sort === b.category.sort ? a.sort - b.sort : a.category.sort - b.category.sort,
                    );
                const pagesWithoutCategories = _pages.filter((page) => !page.category).sort((a, b) => a.sort - b.sort);
                setPages([...pagesWithCategories, ...pagesWithoutCategories]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return hasPages ? (
        <>
            {pagesArray.map((page) => {
                return (
                    <PageLink
                        key={page.id}
                        page={page}
                        selectedUrl={selectedUrl}
                        onSelectUrl={onSelectUrl}
                        itemsToExpandInitially={itemsToExpandInitially}
                        getDocumentSectionsByDocumentPageId={getDocumentSectionsByDocumentPageId}
                    />
                );
            })}
        </>
    ) : (
        <div className="tw-h-10 tw-flex tw-items-center tw-pr-2.5 tw-pl-7 tw-leading-5 tw-text-s tw-text-text-weak">
            This document does not contain any pages.
        </div>
    );
};
