/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentPage, type DocumentSection } from '@frontify/app-bridge';
import { IconColorFan } from '@frontify/fondue/icons';
import { useEffect, useState } from 'react';

import { type InitiallyExpandedItems } from '../types';

import { PageLinks } from './PageLinks';

type DocumentLinkProps = {
    document: {
        id: number;
        title: string;
        permanentLink: string;
    };
    selectedUrl: string;
    onSelectUrl: (url: string) => void;
    itemsToExpandInitially: InitiallyExpandedItems;
    getDocumentSectionsByDocumentPageId: (documentPageId: number) => Promise<DocumentSection[]>;
    getDocumentPagesByDocumentId: (documentId: number) => Promise<DocumentPage[]>;
};

export const DocumentLink = ({
    document,
    selectedUrl,
    onSelectUrl,
    itemsToExpandInitially,
    getDocumentSectionsByDocumentPageId,
    getDocumentPagesByDocumentId,
}: DocumentLinkProps) => {
    const [isExpanded, setIsExpanded] = useState(document.id === itemsToExpandInitially.documentId);
    const isActive = document.permanentLink === selectedUrl;

    useEffect(() => {
        if (document.id === itemsToExpandInitially.documentId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsExpanded(true);
        }
    }, [itemsToExpandInitially, document.id]);

    return (
        <>
            <button
                type="button"
                data-test-id="internal-link-selector-document-link"
                className={`tw-flex tw-flex-1 tw-space-x-2 tw-items-center tw-py-2 tw-pr-2.5 tw-leading-5 tw-cursor-pointer tw-w-full ${
                    isActive
                        ? 'tw-bg-highlight tw-text-highlight-on-highlight hover:tw-bg-highlight-hover:hover hover:tw-text-highlight-on-highlight:hover'
                        : 'hover:tw-bg-container-secondary-hover hover:tw-text-container-secondary-on-secondary-container'
                }`}
                onClick={() => onSelectUrl(document.permanentLink)}
            >
                <button
                    type="button"
                    tabIndex={0}
                    data-test-id="tree-item-toggle"
                    className="tw-flex tw-items-center tw-justify-center -tw-mr-2 tw-pr-3.5 tw-pt-1.5 tw-pb-1.5 tw-pl-3.5 tw-cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                    onKeyDown={(event) => event.key === 'Enter' && event.stopPropagation()}
                >
                    <div
                        className={`tw-transition-transform tw-w-0 tw-h-0 tw-font-normal tw-border-t-4 tw-border-t-transparent tw-border-b-4 tw-border-b-transparent tw-border-l-4 tw-border-l-x-strong ${isExpanded ? 'tw-rotate-90' : ''}`}
                    ></div>
                </button>
                <IconColorFan size={16} />
                <span className="tw-text-small">{document.title}</span>
                <span className="tw-flex-auto tw-font-sans tw-text-x-small tw-text-right">Document</span>
            </button>
            {isExpanded && (
                <PageLinks
                    documentId={document.id}
                    selectedUrl={selectedUrl}
                    onSelectUrl={onSelectUrl}
                    itemsToExpandInitially={itemsToExpandInitially}
                    getDocumentSectionsByDocumentPageId={getDocumentSectionsByDocumentPageId}
                    getDocumentPagesByDocumentId={getDocumentPagesByDocumentId}
                />
            )}
        </>
    );
};
