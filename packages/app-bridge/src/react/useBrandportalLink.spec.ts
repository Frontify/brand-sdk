// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BrandportalLinkDummy, getAppBridgeThemeStub } from '../tests';

import { useBrandportalLink } from './useBrandportalLink';

describe('useBrandportalLink', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the brandportal link from appBridge', async () => {
        const appBridge = getAppBridgeThemeStub();

        const brandportalLink = BrandportalLinkDummy.with();
        appBridge.getBrandportalLink.resolves(brandportalLink);

        const { result } = renderHook(() => useBrandportalLink(appBridge));

        expect(result.current.brandportalLink).toBe(null);

        await act(async () => {
            await appBridge.getBrandportalLink();
        });

        expect(result.current.brandportalLink).toEqual(brandportalLink);
    });

    it('should update the brandportal link when an event is emitted', () => {
        const appBridge = getAppBridgeThemeStub();
        const { result } = renderHook(() => useBrandportalLink(appBridge));

        const updatedBrandportalLink = BrandportalLinkDummy.with({
            label: 'Updated Brandportal Link',
        });

        act(() => {
            window.emitter.emit('AppBridge:GuidelineBrandportalLink:Action', {
                action: 'update',
                brandportalLink: updatedBrandportalLink,
            });
        });

        expect(result.current.brandportalLink).toEqual(updatedBrandportalLink);
    });

    it('should not update the brandportal link when an event with an invalid action is emitted', () => {
        const appBridge = getAppBridgeThemeStub();
        const { result } = renderHook(() => useBrandportalLink(appBridge));

        result.current.brandportalLink = BrandportalLinkDummy.with();

        act(() => {
            window.emitter.emit('AppBridge:GuidelineBrandportalLink:Action', {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                action: 'invalid' as any,
                brandportalLink: { enabled: false, label: '', url: '' },
            });
        });

        expect(result.current.brandportalLink).toEqual(BrandportalLinkDummy.with());
    });

    it('should start fetching only when it is enabled', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(appBridge, 'getBrandportalLink');

        let enabled = false;

        const { rerender } = renderHook(() => useBrandportalLink(appBridge, { enabled }));

        expect(spy).not.toBeCalled();

        enabled = true;
        rerender();

        expect(spy).toBeCalled();
    });

    it('should unregister when unmounted', () => {
        const appBridge = getAppBridgeThemeStub();
        const spy = vi.spyOn(window.emitter, 'off');

        const { unmount } = renderHook(() => useBrandportalLink(appBridge));

        unmount();

        expect(spy).toBeCalledWith('AppBridge:GuidelineBrandportalLink:Action', expect.any(Function));
    });
});
