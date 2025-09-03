/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MultiFlyoutContextProvider, type MultiFlyoutContextType } from '../context/MultiFlyoutContext';

import { useMultiFlyoutState } from './useMultiFlyoutState';

const FLYOUT_ID = 'flyout';

const renderMultiFlyoutState = ({ openFlyoutIds, setOpenFlyoutIds }: MultiFlyoutContextType) =>
    renderHook(() => useMultiFlyoutState(FLYOUT_ID), {
        wrapper: ({ children }) => (
            <MultiFlyoutContextProvider openFlyoutIds={openFlyoutIds} setOpenFlyoutIds={setOpenFlyoutIds}>
                {children}
            </MultiFlyoutContextProvider>
        ),
    });

describe('useMultiFlyoutState', () => {
    it('should be open when flyout id in context array', () => {
        const { result } = renderMultiFlyoutState({ openFlyoutIds: [FLYOUT_ID], setOpenFlyoutIds: vi.fn() });
        expect(result.current.isOpen).toEqual(true);
    });

    it('should be closed when flyout id is not in context array', () => {
        const { result } = renderMultiFlyoutState({ openFlyoutIds: [], setOpenFlyoutIds: vi.fn() });
        expect(result.current.isOpen).toEqual(false);
    });

    it('should add id to array when opening', () => {
        const setOpenFlyoutIdsStub = vi.fn();
        const { result } = renderMultiFlyoutState({ openFlyoutIds: [], setOpenFlyoutIds: setOpenFlyoutIdsStub });

        result.current.onOpenChange(true);
        const dispatchedResult = setOpenFlyoutIdsStub.mock.lastCall?.[0]([]);

        expect(dispatchedResult).toEqual([FLYOUT_ID]);
    });

    it('should remove id from array when closing', () => {
        const setOpenFlyoutIdsStub = vi.fn();
        const { result } = renderMultiFlyoutState({ openFlyoutIds: [], setOpenFlyoutIds: setOpenFlyoutIdsStub });

        result.current.onOpenChange(false);
        const dispatchedResult = setOpenFlyoutIdsStub.mock.lastCall?.[0]([FLYOUT_ID]);

        expect(dispatchedResult).toEqual([]);
    });

    it('should remove duplicates from array', () => {
        const setOpenFlyoutIdsStub = vi.fn();
        const { result } = renderMultiFlyoutState({ openFlyoutIds: [], setOpenFlyoutIds: setOpenFlyoutIdsStub });

        result.current.onOpenChange(true);
        const dispatchedResult = setOpenFlyoutIdsStub.mock.lastCall?.[0]([FLYOUT_ID, FLYOUT_ID, FLYOUT_ID]);

        expect(dispatchedResult).toEqual([FLYOUT_ID]);
    });
});
