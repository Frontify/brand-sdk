/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset, AssetDummy, getAppBridgeBlockStub } from '@frontify/app-bridge';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Attachments } from './Attachments';
import { type AttachmentsProps } from './types';

const FLYOUT_TRIGGER_TEST_ID = 'attachments-button-trigger';
const ASSET_INPUT_TEST_ID = 'asset-input-placeholder';
const ACTION_BAR_TEST_ID = 'attachments-actionbar';
const ACTION_BAR_FLYOUT_TEST_ID = 'attachments-actionbar-flyout';
const ATTACHMENT_ITEM_TEST_ID = 'attachments-item';
const LOADING_CIRCLE_TEST_ID = 'fondue-loading-circle-content';

const renderAttachments = ({
    appBridge = getAppBridgeBlockStub(),
    onDelete = vi.fn(),
    items,
    onReplaceWithBrowse = vi.fn(),
    onReplaceWithUpload = vi.fn(),
    onSorted = vi.fn(),
    onBrowse = vi.fn(),
    onUpload = vi.fn(),
}: Partial<AttachmentsProps> = {}) =>
    render(
        <Attachments
            appBridge={appBridge}
            onDelete={onDelete}
            items={items}
            onReplaceWithBrowse={onReplaceWithBrowse}
            onReplaceWithUpload={onReplaceWithUpload}
            onSorted={onSorted}
            onBrowse={onBrowse}
            onUpload={onUpload}
        />,
    );

const openFlyout = async () => {
    await userEvent.click(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]);
};

describe('Attachments', () => {
    beforeAll(() => {
        vi.stubGlobal(
            'Worker',
            class Worker {
                addEventListener() {}
                terminate() {}
            },
        );
    });

    it('should render the attachments flyout if it is in edit mode', () => {
        renderAttachments({ appBridge: getAppBridgeBlockStub({ editorState: true }) });

        expect(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]).toBeInTheDocument();
    });

    it('should render the attachments flyout if it has attachments', () => {
        renderAttachments({ items: [AssetDummy.with(1)] });

        expect(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]).toBeInTheDocument();
    });

    it('should not render the attachments flyout if there are no attachments', () => {
        renderAttachments({ items: [] });

        expect(screen.queryByTestId(FLYOUT_TRIGGER_TEST_ID)).not.toBeInTheDocument();
    });

    it('should announce the action and the number of attachments on the trigger', () => {
        renderAttachments({ items: [AssetDummy.with(1)] });

        expect(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]).toHaveAccessibleName('Open attachments, 1 attachment');
    });

    it('should pluralize the number of attachments on the trigger', () => {
        renderAttachments({ items: [AssetDummy.with(1), AssetDummy.with(2)] });

        expect(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]).toHaveAccessibleName(
            'Open attachments, 2 attachments',
        );
    });

    it('should announce the add action on the trigger if there are no attachments', () => {
        renderAttachments({ appBridge: getAppBridgeBlockStub({ editorState: true }), items: [] });

        expect(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]).toHaveAccessibleName('Add attachments');
    });

    it('should mark the trigger as having a menu popup', () => {
        renderAttachments({ items: [AssetDummy.with(1)] });

        expect(screen.getAllByTestId(FLYOUT_TRIGGER_TEST_ID)[0]).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should render the asset input if it is in edit mode', async () => {
        renderAttachments({ appBridge: getAppBridgeBlockStub({ editorState: true }), items: [AssetDummy.with(1)] });

        await openFlyout();

        expect(await screen.findByTestId(ASSET_INPUT_TEST_ID)).toBeInTheDocument();
    });

    it('should not render the asset input if it is in view mode', async () => {
        renderAttachments({ items: [AssetDummy.with(1)] });

        await openFlyout();

        await screen.findAllByTestId(ATTACHMENT_ITEM_TEST_ID);
        expect(screen.queryByTestId(ASSET_INPUT_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render the asset action buttons if it is in edit mode', async () => {
        renderAttachments({ appBridge: getAppBridgeBlockStub({ editorState: true }), items: [AssetDummy.with(1)] });

        await openFlyout();

        expect(await screen.findByTestId(ACTION_BAR_TEST_ID)).toBeInTheDocument();
    });

    it('should not render the asset action buttons if it is in view mode', async () => {
        renderAttachments({ items: [AssetDummy.with(1)] });

        await openFlyout();

        await screen.findAllByTestId(ATTACHMENT_ITEM_TEST_ID);
        expect(screen.queryByTestId(ACTION_BAR_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render an attachment item for each asset', async () => {
        renderAttachments({ items: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)] });

        await openFlyout();

        expect(await screen.findAllByTestId(ATTACHMENT_ITEM_TEST_ID)).toHaveLength(3);
    });

    it('should render a loading circle for an attachment item while it is being replaced', async () => {
        const appBridge = getAppBridgeBlockStub({ editorState: true });

        const chosenAssets = [AssetDummy.with(4)];
        let onAssetsChosen: ((event: { assets: Asset[] }) => void) | undefined;

        (appBridge as unknown as { openAssetChooser: (callback: (assets: Asset[]) => void) => void }).openAssetChooser =
            vi.fn((callback: (assets: Asset[]) => void) => {
                callback(chosenAssets);
            });

        (
            appBridge as unknown as {
                subscribe: (eventName: string, handler: (event: { assets: Asset[] }) => void) => () => void;
            }
        ).subscribe = vi.fn((eventName: string, handler: (event: { assets: Asset[] }) => void) => {
            if (eventName === 'assetsChosen') {
                onAssetsChosen = handler;
            }
            return () => {};
        });

        let resolveReplace: (() => void) | undefined;
        const onReplaceWithBrowse = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveReplace = resolve;
                }),
        );

        renderAttachments({
            onReplaceWithBrowse,
            items: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)],
            appBridge,
        });

        await openFlyout();

        const actionBarFlyouts = await screen.findAllByTestId(ACTION_BAR_FLYOUT_TEST_ID);
        await userEvent.click(within(actionBarFlyouts[0]).getByRole('button'));
        await userEvent.click(await screen.findByText('Replace with asset'));

        await act(async () => {
            onAssetsChosen?.({ assets: chosenAssets });
            await Promise.resolve();
        });

        expect(onReplaceWithBrowse).toHaveBeenCalledTimes(1);
        expect(await screen.findByTestId(LOADING_CIRCLE_TEST_ID)).toBeInTheDocument();

        await act(async () => {
            resolveReplace?.();
            await Promise.resolve();
        });

        await waitFor(() => {
            expect(screen.queryByTestId(LOADING_CIRCLE_TEST_ID)).not.toBeInTheDocument();
        });
    });

    it('should reorder the items using only keyboard events', async () => {
        const ITEM_HEIGHT = 50;
        const ITEM_WIDTH = 300;
        const rectOf = (top: number, height: number) =>
            ({
                x: 0,
                y: top,
                top,
                left: 0,
                bottom: top + height,
                right: ITEM_WIDTH,
                width: height === 0 ? 0 : ITEM_WIDTH,
                height,
                toJSON: () => ({}),
            }) as DOMRect;

        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
            const items = [...document.querySelectorAll(`[data-test-id="${ATTACHMENT_ITEM_TEST_ID}"]`)];
            const index = items.indexOf(this);

            if (index !== -1) {
                return rectOf(index * ITEM_HEIGHT, ITEM_HEIGHT);
            }
            if (this.querySelector(`[data-test-id="${ATTACHMENT_ITEM_TEST_ID}"]`) !== null) {
                return rectOf(0, items.length * ITEM_HEIGHT);
            }
            return rectOf(0, 0);
        });

        const onSorted = vi.fn<(sortedAttachments: Asset[]) => void>();
        renderAttachments({
            appBridge: getAppBridgeBlockStub({ editorState: true }),
            items: [{ ...AssetDummy.with(1), title: 'Moved item' }, AssetDummy.with(2), AssetDummy.with(3)],
            onSorted,
        });

        await openFlyout();
        await screen.findAllByTestId(ATTACHMENT_ITEM_TEST_ID);

        const user = userEvent.setup();
        const dragHandle = screen.getAllByLabelText('Drag attachment')[0];
        dragHandle.focus();

        // The block wires up a bare `KeyboardSensor`, so arrow keys translate by dnd-kit's default
        // 25px step — two presses are one item height.
        await user.keyboard(' ');
        await user.keyboard('{ArrowDown}');
        await user.keyboard('{ArrowDown}');
        await user.keyboard(' ');

        await waitFor(() => {
            expect(onSorted).toHaveBeenCalledTimes(1);
        });
        expect(onSorted.mock.lastCall?.[0].map((item) => item.title)).toEqual([
            AssetDummy.with(2).title,
            'Moved item',
            AssetDummy.with(3).title,
        ]);
        expect(screen.getAllByTestId(ATTACHMENT_ITEM_TEST_ID)[1]).toHaveTextContent('Moved item');
    });

    it('should open the attachment action menu with the keyboard', async () => {
        renderAttachments({
            appBridge: getAppBridgeBlockStub({ editorState: true }),
            items: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)],
        });

        await openFlyout();
        await screen.findAllByTestId(ATTACHMENT_ITEM_TEST_ID);

        const user = userEvent.setup();
        await user.tab();
        await user.tab();
        await user.keyboard('{Enter}');

        expect(await screen.findByText('Replace with upload')).toBeInTheDocument();
    });
});
