/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
import { render } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AttachmentsProvider } from '../../../hooks/useAttachments';

import { Toolbar } from './Toolbar';

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
        expect(() =>
            render(
                <Toolbar
                    items={[]}
                    flyoutMenu={{ items: [], isOpen: false, onOpenChange: vi.fn() }}
                    attachments={{ isEnabled: false, isOpen: false, onOpenChange: vi.fn() }}
                />,
            ),
        ).not.toThrowError();
    });

    it('should throw error if toolbar does have attachments enabled without provider', () => {
        expect(() =>
            render(
                <Toolbar
                    items={[]}
                    flyoutMenu={{ items: [], isOpen: false, onOpenChange: vi.fn() }}
                    attachments={{ isEnabled: true, isOpen: false, onOpenChange: vi.fn() }}
                />,
            ),
        ).toThrowError();
    });

    it('should open flyouts if not dragging', async () => {
        const STUB_WITH_NO_ASSETS = getAppBridgeBlockStub({
            blockId: 1,
            blockAssets: { [MOCK_ASSET_FIELD_ID]: [] },
            editorState: true,
        });

        const ToolbarWithAttachments = () => (
            <AttachmentsProvider appBridge={STUB_WITH_NO_ASSETS} assetId={MOCK_ASSET_FIELD_ID}>
                <Toolbar
                    items={[]}
                    flyoutMenu={{
                        items: [
                            [
                                {
                                    title: 'Replace with upload',
                                    icon: <div></div>,
                                    onClick: vi.fn(),
                                },
                            ],
                        ],
                        isOpen: true,
                        onOpenChange: vi.fn(),
                    }}
                    attachments={{ isEnabled: true, isOpen: true, onOpenChange: vi.fn() }}
                    isDragging={false}
                />
            </AttachmentsProvider>
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
            <AttachmentsProvider appBridge={STUB_WITH_NO_ASSETS} assetId={MOCK_ASSET_FIELD_ID}>
                <Toolbar
                    items={[]}
                    flyoutMenu={{
                        items: [
                            [
                                {
                                    title: 'Replace with upload',
                                    icon: <div></div>,
                                    onClick: vi.fn(),
                                },
                            ],
                        ],
                        isOpen: true,
                        onOpenChange: vi.fn(),
                    }}
                    attachments={{ isEnabled: true, isOpen: true, onOpenChange: vi.fn() }}
                    isDragging
                />
            </AttachmentsProvider>
        );

        const { baseElement } = render(<ToolbarWithAttachments />, { container: document.body });
        expect(baseElement.querySelector(`[data-test-id=${ATTACHMENTS_FLYOUT_ID}]`)).toBeNull();
        expect(baseElement.querySelector(`[data-test-id=${MENU_FLYOUT_ID}]`)).toBeNull();
    });
});
