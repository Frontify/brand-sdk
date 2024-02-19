/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge';
import { IconArrowMove16, IconMoveTo, IconTrashBin } from '@frontify/fondue';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AttachmentsProvider } from '../../../hooks/useAttachments';

import { Toolbar } from './Toolbar';
import { MultiFlyoutContextProvider } from './context/MultiFlyoutContext';
import { DEFAULT_ATTACHMENTS_BUTTON_ID, DEFAULT_MENU_BUTTON_ID, ToolbarItem } from '.';
import { DragPreviewContextProvider } from './context/DragPreviewContext';

/**
 * @vitest-environment happy-dom
 */

const ATTACHMENTS_FLYOUT_ID = 'attachments-flyout-content';
const MENU_FLYOUT_ID = 'menu-item';

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
            icon: <IconArrowMove16 />,
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

    it('should not throw error if toolbar does not have attachments enabled', () => {
        expect(() => render(<Toolbar items={[]} attachments={{ isEnabled: false }} />)).not.toThrowError();
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

        await fireEvent.click(attachmentBtn);
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(1);

        await fireEvent.drag(dragBtn);
        expect(stubs.onDrag).toHaveBeenCalledTimes(1);

        await fireEvent.click(btn);
        expect(stubs.onClick).toHaveBeenCalledTimes(1);

        await fireEvent.click(flyoutBtn);
        expect(stubs.setOpenFlyoutIds).toHaveBeenCalledTimes(2);

        await fireEvent.click(menuBtn);
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
