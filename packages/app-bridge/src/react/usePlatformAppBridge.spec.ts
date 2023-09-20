/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePlatformAppBridge } from './usePlatformAppBridge';
import { renderHook, waitFor } from '@testing-library/react';

describe('usePlatformAppBridge', () => {
    const TOKEN = 'AjY34F87Dsat^J';

    window.location.search = `?token=${TOKEN}`;
    vi.mock('../utilities/subscribe', () => ({
        subscribe: vi.fn().mockResolvedValue({ test: 'passed' }),
    }));

    vi.mock('../utilities/notify', () => ({
        notify: vi.fn(),
    }));

    afterEach(() => {
        vi.clearAllMocks();
    });
    it('should return platformAppBridge', async () => {
        const { result } = renderHook(() => usePlatformAppBridge());
        expect(result.current.platformAppBridge).toBeDefined();
    });
    it('should return initiated false', async () => {
        const { result } = renderHook(() => usePlatformAppBridge());
        expect(result.current.connected).toBe(false);
    });
    it('should return initiated true after waiting', async () => {
        const { result } = renderHook(() => usePlatformAppBridge());
        await waitFor(() => {
            expect(result.current.connected).toBe(true);
        });
    });
});
