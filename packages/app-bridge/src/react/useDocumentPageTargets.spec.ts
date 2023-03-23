/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import mitt from 'mitt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppBridgeBase } from '../AppBridgeBase';

import { DocumentPageTargetsDummy } from '../tests';
import { useDocumentPageTargets } from './useDocumentPageTargets';

const DOCUMENT_PAGE_ID = 345;

describe('useDocumentPageTargets', () => {
    const appBridge: AppBridgeBase = {} as AppBridgeBase;

    beforeEach(() => {
        window.emitter = mitt();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the document page targets from appBridge', async () => {
        const documentPageTargets = DocumentPageTargetsDummy.with(DOCUMENT_PAGE_ID);

        appBridge.getDocumentPageTargets = vi.fn().mockResolvedValue(documentPageTargets);

        const { result } = renderHook(() => useDocumentPageTargets(appBridge, DOCUMENT_PAGE_ID));

        expect(result.current.documentPageTargets).toBe(null);

        await act(async () => {
            await appBridge.getDocumentPageTargets(DOCUMENT_PAGE_ID);
        });

        expect(result.current.documentPageTargets).toEqual(documentPageTargets);
    });
});
