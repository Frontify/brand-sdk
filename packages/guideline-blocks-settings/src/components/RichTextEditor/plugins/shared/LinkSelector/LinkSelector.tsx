/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock } from '@frontify/app-bridge';
import { Button, ButtonEmphasis, ButtonSize, ButtonStyle, ButtonType, IconLink, Modal } from '@frontify/fondue';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { KeyboardEvent, ReactElement, useEffect, useState } from 'react';
import { DocumentLinks } from './DocumentLinks';

type LinkSelectorProps = {
    appBridge: AppBridgeBlock;
    url: string;
    onUrlChange: (value: string) => void;
};

export const LinkSelector = ({ appBridge, url, onUrlChange }: LinkSelectorProps): ReactElement => {
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
        onUrlChange(selectedUrl);
        closeLinkTree();
    };

    return (
        <div data-test-id="internal-link-selector" onKeyDown={onPressEnter}>
            <Button
                icon={<IconLink />}
                size={ButtonSize.Medium}
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
                    <DocumentLinks appBridge={appBridge} selectedUrl={selectedUrl} onSelectUrl={onSelectUrl} />
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
                            onClick: (event) => {
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
