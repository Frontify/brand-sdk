/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt, { Emitter } from 'mitt';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import type { EmitterEvents } from '../types';
import type { AppBridgeTheme } from '../AppBridgeTheme';

import { useBrandportalLink } from './useBrandportalLink';
import { BrandportalLinkDummy } from '../tests';

describe('useBrandportalLink', () => {
    const appBridge: AppBridgeTheme = {} as AppBridgeTheme;
    let emitter: Emitter<EmitterEvents>;

    beforeAll(() => {
        window.emitter = mitt();
    });

    beforeEach(() => {
        emitter = mitt();
        vi.spyOn(window, 'emitter', 'get').mockReturnValue(emitter);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the brandportal link from appBridge', async () => {
        const brandportalLink = BrandportalLinkDummy.with();

        appBridge.getBrandportalLink = vi.fn().mockResolvedValue(brandportalLink);

        const { result } = renderHook(() => useBrandportalLink(appBridge));

        expect(result.current.brandportalLink).toBe(null);

        await act(async () => {
            await appBridge.getBrandportalLink();
        });

        expect(result.current.brandportalLink).toEqual(brandportalLink);
    });

    it('should update the brandportal link when an event is emitted', () => {
        const { result } = renderHook(() => useBrandportalLink(appBridge));

        const updatedBrandportalLink = BrandportalLinkDummy.with({
            label: 'Updated Brandportal Link',
        });

        act(() => {
            window.emitter.emit('AppBridge:GuidelineBrandportalLinkAction', {
                action: 'update',
                brandportalLink: updatedBrandportalLink,
            });
        });

        expect(result.current.brandportalLink).toEqual(updatedBrandportalLink);
    });

    it('should not update the brandportal link when an event with an invalid action is emitted', () => {
        const { result } = renderHook(() => useBrandportalLink(appBridge));

        result.current.brandportalLink = BrandportalLinkDummy.with();

        act(() => {
            window.emitter.emit('AppBridge:GuidelineBrandportalLinkAction', {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                action: 'invalid' as any,
                brandportalLink: { enabled: false, label: '', url: '' },
            });
        });

        expect(result.current.brandportalLink).toEqual(BrandportalLinkDummy.with());
    });
});
