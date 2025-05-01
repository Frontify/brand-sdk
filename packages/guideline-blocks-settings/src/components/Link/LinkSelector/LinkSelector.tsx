/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Document, type DocumentPage, type DocumentSection } from '@frontify/app-bridge';
import { Button, ButtonEmphasis, ButtonSize, ButtonStyle, ButtonType, IconLink, Modal } from '@frontify/fondue';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { type KeyboardEvent, type ReactElement, useEffect, useState } from 'react';

import { DocumentLinks } from './DocumentLinks';

type LinkSelectorProps = {
    url: string;
    onUrlChange?: (value: string) => void;
    buttonSize?: ButtonSize;
    getAllDocuments: () => Promise<Document[]>;
    getDocumentSectionsByDocumentPageId: (documentPageId: number) => Promise<DocumentSection[]>;
    getDocumentPagesByDocumentId: (documentId: number) => Promise<DocumentPage[]>;
};

export const LinkSelector = ({
    url,
    onUrlChange,
    buttonSize = ButtonSize.Medium,
    getAllDocuments,
    getDocumentPagesByDocumentId,
    getDocumentSectionsByDocumentPageId,
}: LinkSelectorProps): ReactElement => {
    const { open: openLinkTree, isOpen: isLinkTreeOpen, close: closeLinkTree } = useOverlayTriggerState({});
    const [selectedUrl, setSelectedUrl] = useState<string>(url);

    const onSelectUrl = (url: string) => {
        setSelectedUrl(url);
    };

    const onPressEnter = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
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
        closeLinkTree();
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            onPointerDown={(event) => event.preventDefault()}
            data-test-id="internal-link-selector"
            onKeyDown={onPressEnter}
        >
            <Button
                icon={<IconLink />}
                size={buttonSize}
                type={ButtonType.Button}
                style={ButtonStyle.Default}
                emphasis={ButtonEmphasis.Default}
                onClick={() => openLinkTree()}
            >
                Internal link
            </Button>
            <Modal zIndex={1001} onClose={() => closeLinkTree()} isOpen={isLinkTreeOpen} isDismissable>
                <Modal.Header title="Select internal link" />
                <Modal.Body>
                    <DocumentLinks
                        selectedUrl={selectedUrl}
                        onSelectUrl={onSelectUrl}
                        getAllDocuments={getAllDocuments}
                        getDocumentPagesByDocumentId={getDocumentPagesByDocumentId}
                        getDocumentSectionsByDocumentPageId={getDocumentSectionsByDocumentPageId}
                    />
                </Modal.Body>
                <Modal.Footer
                    buttons={[
                        {
                            children: 'Cancel',
                            onClick: () => closeLinkTree(),
                            style: ButtonStyle.Default,
                            emphasis: ButtonEmphasis.Default,
                        },
                        {
                            children: 'Choose',
                            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                                event?.preventDefault();
                                saveLink();
                            },
                            style: ButtonStyle.Default,
                            emphasis: ButtonEmphasis.Strong,
                            disabled: !selectedUrl,
                        },
                    ]}
                />
            </Modal>
        </div>
    );
};
