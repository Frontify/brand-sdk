/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIsInViewport } from './useIsInViewport';

describe('useIsInViewport', () => {
    const stubs = vi.hoisted(() => ({
        IntersectionObserver: vi.fn(),
        observe: vi.fn(),
        disconnect: vi.fn(),
    }));

    beforeAll(() => {
        vi.stubGlobal(
            'IntersectionObserver',
            class IntersectionObserver {
                constructor(callback: IntersectionObserverCallback) {
                    stubs.IntersectionObserver(callback);
                }
                observe() {
                    stubs.observe();
                }
                disconnect() {
                    stubs.disconnect();
                }
            },
        );
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should setup an IntersectionObserver and observe the ref', () => {
        const { rerender } = renderHook(() =>
            useIsInViewport({ disabled: false, onChange: vi.fn(), ref: { current: document.createElement('div') } }),
        );

        expect(stubs.IntersectionObserver).toHaveBeenCalledOnce();
        expect(stubs.observe).toHaveBeenCalledOnce();

        rerender();
        expect(stubs.disconnect).toHaveBeenCalledOnce();
    });

    it('should not setup an IntersectionObserver if disabled', () => {
        renderHook(() =>
            useIsInViewport({ disabled: true, onChange: vi.fn(), ref: { current: document.createElement('div') } }),
        );

        expect(stubs.IntersectionObserver).not.toHaveBeenCalled();
        expect(stubs.observe).not.toHaveBeenCalled();
    });

    it('should not setup an IntersectionObserver if ref.current is null', () => {
        renderHook(() => useIsInViewport({ disabled: false, onChange: vi.fn(), ref: { current: null } }));

        expect(stubs.IntersectionObserver).not.toHaveBeenCalled();
        expect(stubs.observe).not.toHaveBeenCalled();
    });

    it('should call onChange only when isIntersecting changes', () => {
        const onChangeStub = vi.fn();
        renderHook(() =>
            useIsInViewport({
                disabled: false,
                onChange: onChangeStub,
                ref: { current: document.createElement('div') },
            }),
        );

        expect(stubs.IntersectionObserver).toHaveBeenCalledOnce();

        const callback = stubs.IntersectionObserver.mock.calls[0][0];
        callback([{ isIntersecting: true }]);

        expect(onChangeStub).toHaveBeenCalledOnce();
        expect(onChangeStub).toHaveBeenCalledWith(true);

        callback([{ isIntersecting: true }]);

        expect(onChangeStub).toHaveBeenCalledOnce();

        callback([{ isIntersecting: false }]);

        expect(onChangeStub).toHaveBeenCalledTimes(2);
        expect(onChangeStub).toHaveBeenCalledWith(false);

        callback([{ isIntersecting: false }]);

        expect(onChangeStub).toHaveBeenCalledTimes(2);
        expect(onChangeStub).toHaveBeenCalledWith(false);
    });
});
