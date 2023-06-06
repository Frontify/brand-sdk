// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import { DocumentDummy, getAppBridgeThemeStub } from '../tests';

import { useUngroupedDocuments } from './useUngroupedDocuments';

const DOCUMENT_ID_1 = 6456;
const DOCUMENT_ID_2 = 34532;
const DOCUMENT_ID_3 = 3455345;
const DOCUMENT_ID_4 = 2342;
const DOCUMENT_ID_5 = 2343445;

describe('useUngroupedDocuments', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch ungrouped documents on mount', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const { result } = renderHook(() => useUngroupedDocuments(appBridge));

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);

            expect(result.current.documents).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]);
        });
    });

    it('should not fetch ungrouped documents on mount if not enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        const { result } = renderHook(() => useUngroupedDocuments(appBridge, { enabled: false }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);
    });

    it('should fetch ungrouped documents if it gets enabled', async () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getUngroupedDocuments');

        let enabled = false;

        const { result, rerender } = renderHook(() => useUngroupedDocuments(appBridge, { enabled }));

        expect(result.current.isLoading).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        expect(result.current.documents).toEqual([]);

        enabled = true;

        rerender();

        expect(result.current.isLoading).toBe(true);
        expect(spy).toHaveBeenCalledOnce();

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.documents).toEqual([
                DocumentDummy.with(DOCUMENT_ID_1),
                DocumentDummy.with(DOCUMENT_ID_2),
                DocumentDummy.with(DOCUMENT_ID_3),
                DocumentDummy.with(DOCUMENT_ID_4),
                DocumentDummy.with(DOCUMENT_ID_5),
            ]);
        });
    });
});
