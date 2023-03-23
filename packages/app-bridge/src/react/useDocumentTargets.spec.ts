/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import mitt from 'mitt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppBridgeBase } from '../AppBridgeBase';

import { DocumentTargetsDummy } from '../tests';
import { useDocumentTargets } from './useDocumentTargets';

const DOCUMENT_ID = 92341;

describe('useDocumentTargets', () => {
    const appBridge: AppBridgeBase = {} as AppBridgeBase;

    beforeEach(() => {
        window.emitter = mitt();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the document targets from appBridge', async () => {
        const documentTargets = DocumentTargetsDummy.with(DOCUMENT_ID);

        appBridge.getDocumentTargets = vi.fn().mockResolvedValue(documentTargets);

        const { result } = renderHook(() => useDocumentTargets(appBridge, DOCUMENT_ID));

        expect(result.current.documentTargets).toBe(null);

        await act(async () => {
            await appBridge.getDocumentTargets(DOCUMENT_ID);
        });

        expect(result.current.documentTargets).toEqual(documentTargets);
    });
});
