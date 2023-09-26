/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock, AppBridgeTheme } from '@frontify/app-bridge';
import { useEffect, useState } from 'react';
import { PageLinks } from './PageLinks';
import { IconColorFan16, merge } from '@frontify/fondue';
import { InitiallyExpandedItems } from '../';

type DocumentLinkProps = {
    document: {
        id: number;
        title: string;
        permanentLink: string;
    };
    appBridge: AppBridgeBlock | AppBridgeTheme;
    selectedUrl: string;
    onSelectUrl: (url: string) => void;
    itemsToExpandInitially: InitiallyExpandedItems;
};

export const DocumentLink = ({
    document,
    appBridge,
    selectedUrl,
    onSelectUrl,
    itemsToExpandInitially,
}: DocumentLinkProps) => {
    const [isExpanded, setIsExpanded] = useState(document.id === itemsToExpandInitially.documentId);
    const isActive = document.permanentLink === selectedUrl;

    useEffect(() => {
        if (document.id === itemsToExpandInitially.documentId) {
            setIsExpanded(true);
        }
    }, [itemsToExpandInitially, document.id]);

    return (
        <>
            <button
                data-test-id="internal-link-selector-document-link"
                className={merge([
                    'tw-flex tw-flex-1 tw-space-x-2 tw-items-center tw-py-2 tw-pr-2.5 tw-leading-5 tw-cursor-pointer tw-w-full',
                    isActive
                        ? 'tw-bg-box-selected-strong tw-text-box-selected-strong-inverse hover:tw-bg-box-selected-strong-hover:hover hover:tw-text-box-selected-strong-inverse-hover:hover'
                        : 'hover:tw-bg-box-neutral-hover hover:tw-text-box-neutral-inverse-hover',
                ])}
                onClick={() => onSelectUrl(document.permanentLink)}
            >
                <button
                    role="button"
                    tabIndex={0}
                    data-test-id="tree-item-toggle"
                    className="tw-flex tw-items-center tw-justify-center -tw-mr-2 tw-pr-3.5 tw-pt-1.5 tw-pb-1.5 tw-pl-3.5 tw-cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div
                        className={merge([
                            'tw-transition-transform tw-w-0 tw-h-0 tw-font-normal tw-border-t-4 tw-border-t-transparent tw-border-b-4 tw-border-b-transparent tw-border-l-4 tw-border-l-x-strong',
                            isExpanded ? 'tw-rotate-90' : '',
                        ])}
                    ></div>
                </button>
                <IconColorFan16 />
                <span className="tw-text-s">{document.title}</span>
                <span className="tw-flex-auto tw-font-sans tw-text-xs tw-text-right">Document</span>
            </button>
            {isExpanded && (
                <PageLinks
                    appBridge={appBridge}
                    documentId={document.id}
                    selectedUrl={selectedUrl}
                    onSelectUrl={onSelectUrl}
                    itemsToExpandInitially={itemsToExpandInitially}
                />
            )}
        </>
    );
};
