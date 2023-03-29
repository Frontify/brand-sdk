/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import mitt from 'mitt';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';

import { DocumentTargetsDummy } from '../tests';
import { useDocumentTargets } from './useDocumentTargets';

const DOCUMENT_ID = 92341;

describe('useDocumentTargets', () => {
    const appBridge: AppBridgeBlock | AppBridgeTheme = {} as AppBridgeBlock | AppBridgeTheme;

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
