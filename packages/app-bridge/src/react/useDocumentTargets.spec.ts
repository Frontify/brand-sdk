/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AppBridgeTheme } from '../AppBridgeTheme';

import { TargetsDummy } from '../tests';
import { useDocumentTargets } from './useDocumentTargets';

describe('useDocumentTargets', () => {
    const appBridge: AppBridgeTheme = {} as AppBridgeTheme;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the document targets from appBridge', async () => {
        const documentTargets = TargetsDummy.with();

        appBridge.getDocumentTargets = vi.fn().mockResolvedValue(documentTargets);

        const { result } = renderHook(() => useDocumentTargets(appBridge, 1));

        expect(result.current.documentTargets.length).toBe(0);

        await act(async () => {
            await appBridge.getDocumentTargets(1);
        });

        expect(result.current.documentTargets).toEqual(documentTargets);
    });

    it('should return the document page targets from appBridge', async () => {
        const documentPageTargets = TargetsDummy.with();

        appBridge.getDocumentPageTargets = vi.fn().mockResolvedValue(documentPageTargets);

        const { result } = renderHook(() => useDocumentTargets(appBridge, 1));

        expect(result.current.documentPageTargets.length).toBe(0);

        await act(async () => {
            await appBridge.getDocumentPageTargets(1);
        });

        expect(result.current.documentPageTargets).toEqual(documentPageTargets);
    });
});
