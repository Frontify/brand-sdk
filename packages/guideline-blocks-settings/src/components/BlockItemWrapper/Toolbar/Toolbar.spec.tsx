/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge';
import { IconArrowMove, IconMoveTo, IconTrashBin } from '@frontify/fondue/icons';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { AttachmentsProvider } from '../../../hooks/useAttachments';

import { DEFAULT_ATTACHMENTS_BUTTON_ID } from './AttachmentsToolbarButton';
import { DEFAULT_MENU_BUTTON_ID } from './MenuToolbarButton';
import { Toolbar } from './Toolbar';
import { DragPreviewContextProvider } from './context/DragPreviewContext';
import { MultiFlyoutContextProvider } from './context/MultiFlyoutContext';
import { type ToolbarItem } from './types';

/**
 * @vitest-environment happy-dom
 */

const ATTACHMENTS_FLYOUT_ID = 'attachments-flyout-content';
const MENU_FLYOUT_ID = 'menu-item';
const TOOLBAR_SEGMENT_ID = 'block-item-wrapper-toolbar-segment';
const MOCK_ASSET_FIELD_ID = 'attachment';

describe('Toolbar', () => {
    const stubs = vi.hoisted(() => ({
        setOpenFlyoutIds: vi.fn(),
        onClick: vi.fn(),
        onDrag: vi.fn(),
        onKeyDown: vi.fn(),
    }));

    const STUB_WITH_NO_ASSETS = getAppBridgeBlockStub({
        blockId: 1,
        blockAssets: { [MOCK_ASSET_FIELD_ID]: [] },
        editorState: true,
    });

    const FULL_ITEMS: ToolbarItem[] = [
        {
            type: 'dragHandle',
            setActivatorNodeRef: vi.fn(),
            icon: <IconMoveTo />,
            draggableProps: { onDrag: stubs.onDrag, onKeyDown: stubs.onKeyDown },
        },
        {
            type: 'button',
            onClick: stubs.onClick,
            icon: <IconTrashBin />,
        },
        {
            type: 'flyout',
            icon: <IconArrowMove size="16" />,
            tooltip: 'Move To',
            content: <div>Content</div>,
            flyoutHeader: <div>Fixed Header</div>,
            flyoutFooter: <div>Fixed Footer</div>,
            flyoutId: 'move',
        },
        {
            type: 'menu',
            items: [
                [
                    {
                        title: 'Replace with upload',
                        icon: <div></div>,
                        onClick: stubs.onClick,
                    },
                ],
            ],
        },
    ];

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

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not throw error if toolbar does not have attachments enabled', () => {
        expect(() => render(<Toolbar items={[]} attachments={{ isEnabled: false }} />)).not.toThrowError();
    });

    it('should render toolbar segment there are items in it', () => {
        const { queryByTestId } = render(<Toolbar items={FULL_ITEMS} attachments={{ isEnabled: false }} />);
        expect(queryByTestId(TOOLBAR_SEGMENT_ID)).toBeTruthy();
    });

    it('should not render toolbar segment if there are no items in it', () => {
        const { queryByTestId } = render(<Toolbar items={[]} attachments={{ isEnabled: false }} />);
        expect(queryByTestId(TOOLBAR_SEGMENT_ID)).toBeNull();
    });

    it('should throw error if toolbar does have attachments enabled without provider', () => {
        expect(() => render(<Toolbar items={[]} attachments={{ isEnabled: true }} />)).toThrowError();
    });

    it('should have every item type accessible by mouse', async () => {
        const ToolbarWithAttachments = () => (
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={stubs.setOpenFlyoutIds}>
                <AttachmentsProvider appBridge={STUB_WITH_NO_ASSETS} assetId={MOCK_ASSET_FIELD_ID}>
                    <Toolbar items={FULL_ITEMS} attachments={{ isEnabled: true }} />
                </AttachmentsProvider>
            </MultiFlyoutContextProvider>
        );

        const { getAllByRole } = render(<ToolbarWithAttachments />);

        const buttons = getAllByRole('button');
        expect(buttons).toHaveLength(5);

        const [attachmentBtn, dragBtn, btn, flyoutBtn, menuBtn] = buttons;

        // Click Interactions

        fireEvent.click(attachmentBtn);
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(1);

        fireEvent.drag(dragBtn);
        expect(stubs.onDrag).toHaveBeenCalledTimes(1);

        fireEvent.click(btn);
        expect(stubs.onClick).toHaveBeenCalledTimes(1);

        fireEvent.click(flyoutBtn);
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(2);

        await userEvent.click(menuBtn);
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(3);
    });

    it('should have every item type accessible by keyboard', async () => {
        const ToolbarWithAttachments = () => (
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={stubs.setOpenFlyoutIds}>
                <AttachmentsProvider appBridge={STUB_WITH_NO_ASSETS} assetId={MOCK_ASSET_FIELD_ID}>
                    <Toolbar items={FULL_ITEMS} attachments={{ isEnabled: true }} />
                </AttachmentsProvider>
            </MultiFlyoutContextProvider>
        );

        const user = userEvent.setup();

        const { getAllByRole } = render(<ToolbarWithAttachments />);

        const buttons = getAllByRole('button');
        expect(buttons).toHaveLength(5);

        const [attachmentBtn, dragBtn, btn, flyoutBtn, menuBtn] = buttons;

        await user.keyboard('{Tab}');

        expect(attachmentBtn).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(1);

        await user.keyboard('{Tab}');

        expect(dragBtn).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(stubs.onKeyDown).toHaveBeenCalledTimes(1);

        await user.keyboard('{Tab}');

        expect(btn).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(stubs.onClick).toHaveBeenCalledTimes(1);

        await user.keyboard('{Tab}');

        expect(flyoutBtn).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(2);

        await user.keyboard('{Tab}');

        expect(menuBtn).toHaveFocus();
        await user.keyboard('{Enter}');
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(3);
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
        await waitFor(() => {
            expect(baseElement.querySelector(`[data-test-id=${MENU_FLYOUT_ID}]`)).not.toBeNull();
        });
    });

    it('should keep flyouts closed if dragging', () => {
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
