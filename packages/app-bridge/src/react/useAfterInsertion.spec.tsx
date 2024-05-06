/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { getAppBridgeBlockStub } from '../tests';
import { describe, expect, it, vi } from 'vitest';
import { useAfterInsertion } from './useAfterInsertion';

describe('useAfterInsertion', () => {
    it('should execute a callback after the block has been inserted', () => {
        const appBridge = getAppBridgeBlockStub({ isNewlyInserted: true });
        const callbackStub = vi.fn();
        renderHook(() => useAfterInsertion(appBridge, callbackStub));

        expect(callbackStub).toHaveBeenCalledOnce();
    });

    it('should not execute a callback if the block is not newly inserted', () => {
        const appBridge = getAppBridgeBlockStub({ isNewlyInserted: false });
        const callbackStub = vi.fn();
        renderHook(() => useAfterInsertion(appBridge, callbackStub));

        expect(callbackStub).not.toHaveBeenCalledOnce();
    });

    it('should execute callback if the hook is enabled', () => {
        const appBridge = getAppBridgeBlockStub({ isNewlyInserted: true });
        const callbackStub = vi.fn();
        renderHook(() => useAfterInsertion(appBridge, callbackStub, true));

        expect(callbackStub).toHaveBeenCalledOnce();
    });

    it('should not execute callback if the hook is disabled', () => {
        const appBridge = getAppBridgeBlockStub({ isNewlyInserted: true });
        const callbackStub = vi.fn();
        renderHook(() => useAfterInsertion(appBridge, callbackStub, false));

        expect(callbackStub).not.toHaveBeenCalledOnce();
    });
});
