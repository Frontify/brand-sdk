/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Document, type DocumentPage, type DocumentSection } from '@frontify/app-bridge';
import { Button, Dialog } from '@frontify/fondue/components';
import { IconLink } from '@frontify/fondue/icons';
import { type KeyboardEvent, type ReactElement, useEffect, useState } from 'react';

import './LinkSelector.css';
import { DocumentLinks } from './DocumentLinks';

type LinkSelectorProps = {
    url: string;
    onUrlChange?: (value: string) => void;
    buttonSize?: 'small' | 'medium' | 'large';
    getAllDocuments: () => Promise<Document[]>;
    getDocumentSectionsByDocumentPageId: (documentPageId: number) => Promise<DocumentSection[]>;
    getDocumentPagesByDocumentId: (documentId: number) => Promise<DocumentPage[]>;
};

export const LinkSelector = ({
    url,
    onUrlChange,
    buttonSize = 'medium',
    getAllDocuments,
    getDocumentPagesByDocumentId,
    getDocumentSectionsByDocumentPageId,
}: LinkSelectorProps): ReactElement => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string>(url);

    const onSelectUrl = (url: string) => {
        setSelectedUrl(url);
    };

    const onPressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveLink();
        }
    };

    useEffect(() => {
        if (url && !selectedUrl) {
            setSelectedUrl(url);
        }
    }, [url, selectedUrl]);

    const saveLink = () => {
        onUrlChange?.(selectedUrl);
        setIsModalOpen(false);
    };

    const dialogProps = {
        onOpenAutoFocus: () => {},
        showUnderlay: true,
        'data-is-underlay': true,
        minWidth: '800px',
    };

    return (
        // eslint-disable-next-line jsx-a11y-x/no-static-element-interactions
        <div
            onPointerDown={(event) => event.preventDefault()}
            data-test-id="internal-link-selector"
            onKeyDown={onPressEnter}
        >
            <Dialog.Root modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Dialog.Trigger asChild>
                    <Button size={buttonSize} emphasis="default">
                        <IconLink size="20" />
                        Internal link
                    </Button>
                </Dialog.Trigger>
                <Dialog.Content {...dialogProps}>
                    <Dialog.Header>
                        <Dialog.Title>Select internal link</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <div>
                            <DocumentLinks
                                selectedUrl={selectedUrl}
                                onSelectUrl={onSelectUrl}
                                getAllDocuments={getAllDocuments}
                                getDocumentPagesByDocumentId={getDocumentPagesByDocumentId}
                                getDocumentSectionsByDocumentPageId={getDocumentSectionsByDocumentPageId}
                            />
                        </div>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button size={buttonSize} emphasis="default" onPress={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button size={buttonSize} disabled={!selectedUrl} emphasis="strong" onPress={() => saveLink()}>
                            Choose
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Root>
        </div>
    );
};
