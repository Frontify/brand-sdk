/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePlatformAppBridge } from './usePlatformAppBridge';
import { renderHook, waitFor } from '@testing-library/react';

describe('usePlatformAppBridge', () => {
    const TOKEN = 'AjY34F87Dsat^J';

    window.location.search = `?token=${TOKEN}`;
    vi.mock('../utilities/subscribe', () => ({
        subscribe: vi.fn().mockResolvedValue({
            statePort: { onmessage: vi.fn() },
            apiPort: { onmessage: vi.fn() },
            context: { parentId: 'parentId-test', connected: true },
            state: { settings: 'settings-test' },
        }),
    }));

    vi.mock('../utilities/notify', () => ({
        notify: vi.fn(),
    }));

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return undefined platformApp if not initiated', async () => {
        const { result } = renderHook(() => usePlatformAppBridge());
        expect(result.current).toBeUndefined();
    });

    it('should return platformApp after initiation and waiting', async () => {
        const { result } = renderHook(() => usePlatformAppBridge());
        await waitFor(() => {
            expect(result.current).toBeDefined();
        });
    });
});
