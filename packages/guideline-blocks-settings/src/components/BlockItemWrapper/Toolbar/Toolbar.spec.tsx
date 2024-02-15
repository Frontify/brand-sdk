/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge';
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AttachmentsProvider } from '../../../hooks/useAttachments';

import { Toolbar } from './Toolbar';
import { MultiFlyoutContextProvider } from './context/MultiFlyoutContext';
import { DEFAULT_ATTACHMENTS_BUTTON_ID, DEFAULT_MENU_BUTTON_ID } from '.';
import { DragPreviewContextProvider } from './context/DragPreviewContext';

/**
 * @vitest-environment happy-dom
 */

const ATTACHMENTS_FLYOUT_ID = 'attachments-flyout-content';
const MENU_FLYOUT_ID = 'menu-item';

const MOCK_ASSET_FIELD_ID = 'attachment';

describe('Toolbar', () => {
    beforeAll(() => {
        vi.stubGlobal(
            'Worker',
            class Worker {
                constructor() {}
                addEventListener() {}
                terminate() {}
            },
        );
    });

    it('should not throw error if toolbar does not have attachments enabled', () => {
        expect(() => render(<Toolbar items={[]} attachments={{ isEnabled: false }} />)).not.toThrowError();
    });

    it('should throw error if toolbar does have attachments enabled without provider', () => {
        expect(() => render(<Toolbar items={[]} attachments={{ isEnabled: true }} />)).toThrowError();
    });

    it('should open flyouts if not dragging', async () => {
        const STUB_WITH_NO_ASSETS = getAppBridgeBlockStub({
            blockId: 1,
            blockAssets: { [MOCK_ASSET_FIELD_ID]: [] },
            editorState: true,
        });

        const ToolbarWithAttachments = () => (
            <MultiFlyoutContextProvider
                openFlyoutIds={[DEFAULT_ATTACHMENTS_BUTTON_ID, DEFAULT_MENU_BUTTON_ID]}
                setOpenFlyoutIds={vi.fn()}
            >
                <AttachmentsProvider appBridge={STUB_WITH_NO_ASSETS} assetId={MOCK_ASSET_FIELD_ID}>
                    <Toolbar
                        items={[
                            {
                                type: 'menu',
                                items: [
                                    [
                                        {
                                            title: 'Replace with upload',
                                            icon: <div></div>,
                                            onClick: vi.fn(),
                                        },
                                    ],
                                ],
                            },
                        ]}
                        attachments={{ isEnabled: true }}
                    />
                </AttachmentsProvider>
            </MultiFlyoutContextProvider>
        );

        const { baseElement } = render(<ToolbarWithAttachments />, { container: document.body });

        expect(baseElement.querySelector(`[data-test-id=${ATTACHMENTS_FLYOUT_ID}]`)).not.toBeNull();
        expect(baseElement.querySelector(`[data-test-id=${MENU_FLYOUT_ID}]`)).not.toBeNull();
    });

    it('should keep flyouts closed if dragging', async () => {
        const MOCK_ASSET_FIELD_ID = 'attachment';
        const STUB_WITH_NO_ASSETS = getAppBridgeBlockStub({
            blockId: 1,
            blockAssets: { [MOCK_ASSET_FIELD_ID]: [] },
            editorState: true,
        });

        const ToolbarWithAttachments = () => (
            <MultiFlyoutContextProvider
                openFlyoutIds={[DEFAULT_ATTACHMENTS_BUTTON_ID, DEFAULT_MENU_BUTTON_ID]}
                setOpenFlyoutIds={vi.fn()}
            >
                <DragPreviewContextProvider isDragPreview>
                    <AttachmentsProvider appBridge={STUB_WITH_NO_ASSETS} assetId={MOCK_ASSET_FIELD_ID}>
                        <Toolbar
                            items={[
                                {
                                    type: 'menu',
                                    items: [
                                        [
                                            {
                                                title: 'Replace with upload',
                                                icon: <div></div>,
                                                onClick: vi.fn(),
                                            },
                                        ],
                                    ],
                                },
                            ]}
                            attachments={{ isEnabled: true }}
                        />
                    </AttachmentsProvider>
                </DragPreviewContextProvider>
            </MultiFlyoutContextProvider>
        );

        const { baseElement } = render(<ToolbarWithAttachments />, { container: document.body });
        expect(baseElement.querySelector(`[data-test-id=${ATTACHMENTS_FLYOUT_ID}]`)).toBeNull();
        expect(baseElement.querySelector(`[data-test-id=${MENU_FLYOUT_ID}]`)).toBeNull();
    });
});
