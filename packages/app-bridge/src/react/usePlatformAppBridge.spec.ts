/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePlatformAppBridge } from './usePlatformAppBridge';

describe('usePlatformAppBridge', () => {
    const TOKEN = 'AjY34F87Dsat^J';

    window.location.search = `?token=${TOKEN}`;
    vi.mock('../utilities/subscribe', () => ({
        subscribe: vi.fn().mockResolvedValue({
            statePort: { onmessage: vi.fn() },
            apiPort: { onmessage: vi.fn() },
            context: { parentId: 'parentId-test', connected: true },
            state: { settings: 'settings-test', userState: 'test' },
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
});
