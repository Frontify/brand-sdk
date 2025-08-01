/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetDummy, getAppBridgeBlockStub } from '@frontify/app-bridge';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { AttachmentsProvider } from '../../../../hooks/useAttachments';
import { DragPreviewContextProvider } from '../context/DragPreviewContext';
import { MultiFlyoutContextProvider } from '../context/MultiFlyoutContext';

import { AttachmentsToolbarButton } from './AttachmentsToolbarButton';

const TOOLBAR_BUTTON_ID = 'attachments-button-trigger';
const FLYOUT_CONTENT_ID = 'attachments-flyout-content';
const TOOLTIP_ID = 'fondue-tooltip-content';

const TEST_FLYOUT_ID = 'flyout-id';
const ASSET_ID = 'attachments';

const STUB_WITH_THREE_ASSETS = getAppBridgeBlockStub({
    blockId: 2,
    blockAssets: { [ASSET_ID]: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)] },
    editorState: true,
});

/**
 * @vitest-environment happy-dom
 */

describe('AttachmentsToolbarButton', () => {
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
    it('should disable tooltip and hide flyout when item is in drag preview context', async () => {
        const { getByTestId, queryByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[TEST_FLYOUT_ID]} setOpenFlyoutIds={vi.fn()}>
                <DragPreviewContextProvider isDragPreview>
                    <AttachmentsProvider appBridge={STUB_WITH_THREE_ASSETS} assetId={ASSET_ID}>
                        <AttachmentsToolbarButton flyoutId={TEST_FLYOUT_ID} />
                    </AttachmentsProvider>
                </DragPreviewContextProvider>
            </MultiFlyoutContextProvider>,
        );

        getByTestId(TOOLBAR_BUTTON_ID).focus();

        await waitFor(() => expect(queryByTestId(FLYOUT_CONTENT_ID)).toBeNull());
    });

    it('should open flyout onClick', async () => {
        const setOpenFlyoutIdsStub = vi.fn();
        const { getByTestId } = render(
            <MultiFlyoutContextProvider openFlyoutIds={[]} setOpenFlyoutIds={setOpenFlyoutIdsStub}>
                <DragPreviewContextProvider isDragPreview>
                    <AttachmentsProvider appBridge={STUB_WITH_THREE_ASSETS} assetId={ASSET_ID}>
                        <AttachmentsToolbarButton flyoutId={TEST_FLYOUT_ID} />
                    </AttachmentsProvider>
                </DragPreviewContextProvider>
            </MultiFlyoutContextProvider>,
        );

        await fireEvent.click(getByTestId(TOOLBAR_BUTTON_ID));

        expect(setOpenFlyoutIdsStub).toHaveBeenCalledOnce();
        const dispatchedStateResult = setOpenFlyoutIdsStub.mock.lastCall[0]([]);
        expect(dispatchedStateResult).toEqual([TEST_FLYOUT_ID]);
    });

    it('should open tooltip when item is focused', async () => {
        const { getByTestId } = render(
            <AttachmentsProvider appBridge={STUB_WITH_THREE_ASSETS} assetId={ASSET_ID}>
                <AttachmentsToolbarButton />
            </AttachmentsProvider>,
        );

        getByTestId(TOOLBAR_BUTTON_ID).focus();

        await waitFor(() => expect(getByTestId(TOOLTIP_ID)).toBeInTheDocument());
    });
});
