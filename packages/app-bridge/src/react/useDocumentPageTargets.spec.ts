/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AppBridgeTheme } from '../AppBridgeTheme';

import { TargetsDummy } from '../tests';
import { useDocumentPageTargets } from './useDocumentPageTargets';

const DOCUMENT_PAGE_ID = 345;

describe('useDocumentPageTargets', () => {
    const appBridge: AppBridgeTheme = {} as AppBridgeTheme;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the document page targets from appBridge', async () => {
        const documentPageTargets = TargetsDummy.with();

        appBridge.getDocumentPageTargets = vi.fn().mockResolvedValue(documentPageTargets);

        const { result } = renderHook(() => useDocumentPageTargets(appBridge, DOCUMENT_PAGE_ID));

        expect(result.current.documentPageTargets.length).toBe(0);

        await act(async () => {
            await appBridge.getDocumentPageTargets(DOCUMENT_PAGE_ID);
        });

        expect(result.current.documentPageTargets).toEqual(documentPageTargets);
    });
});
