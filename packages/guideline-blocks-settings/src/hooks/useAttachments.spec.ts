/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetDummy, getAppBridgeBlockStub } from '@frontify/app-bridge';
import { renderHook, waitFor } from '@testing-library/react';

import { describe, expect, it } from 'vitest';
import { useAttachments } from './useAttachments';

const MOCK_SETTINGS_ID = 'attachments';

/**
 * @vitest-environment happy-dom
 */

describe('useAttachments', () => {
    it('should have 1 attachment if attachment is added', async () => {
        const STUB_WITH_NO_ASSETS = getAppBridgeBlockStub({
            blockId: 1,
            blockAssets: { [MOCK_SETTINGS_ID]: [] },
        });
        const { result } = renderHook(() => useAttachments(STUB_WITH_NO_ASSETS, MOCK_SETTINGS_ID));

        await result.current.onAddAttachments([AssetDummy.with(1)]);
        await waitFor(() => {
            expect(result.current.attachments).toHaveLength(1);
        });
    });

    it('should decrease the attachment count from 3 to 2', async () => {
        const STUB_WITH_THREE_ASSETS = getAppBridgeBlockStub({
            blockId: 2,
            blockAssets: { [MOCK_SETTINGS_ID]: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)] },
        });
        const { result } = renderHook(() => useAttachments(STUB_WITH_THREE_ASSETS, MOCK_SETTINGS_ID));

        const initialValue = result.current;
        await waitFor(() => {
            expect(result.current).not.toBe(initialValue);
        });
        await result.current.onAttachmentDelete(AssetDummy.with(1));
        await waitFor(() => {
            expect(result.current.attachments).toHaveLength(2);
        });
    });

    it('should replace the attachment in the same position', async () => {
        const STUB_WITH_THREE_ASSETS = getAppBridgeBlockStub({
            blockId: 2,
            blockAssets: { [MOCK_SETTINGS_ID]: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)] },
        });
        const { result } = renderHook(() => useAttachments(STUB_WITH_THREE_ASSETS, MOCK_SETTINGS_ID));
        const initialValue = result.current;
        await waitFor(() => {
            expect(result.current).not.toBe(initialValue);
        });
        await result.current.onAttachmentReplace(AssetDummy.with(2), AssetDummy.with(10));
        await waitFor(() => {
            expect(result.current.attachments[1].id).toBe(10);
        });
    });

    it('should reorder the attachments', async () => {
        const STUB_WITH_THREE_ASSETS = getAppBridgeBlockStub({
            blockId: 2,
            blockAssets: { [MOCK_SETTINGS_ID]: [AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)] },
        });
        const { result } = renderHook(() => useAttachments(STUB_WITH_THREE_ASSETS, MOCK_SETTINGS_ID));
        const initialValue = result.current;
        await waitFor(() => {
            expect(result.current).not.toBe(initialValue);
        });
        await result.current.onAttachmentsSorted([AssetDummy.with(3), AssetDummy.with(2), AssetDummy.with(1)]);
        await waitFor(() => {
            expect(result.current.attachments[0].id).toBe(3);
            expect(result.current.attachments[1].id).toBe(2);
            expect(result.current.attachments[2].id).toBe(1);
        });
    });
});
