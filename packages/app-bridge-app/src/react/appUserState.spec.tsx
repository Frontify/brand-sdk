/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, it, vi, expect } from 'vitest';

import * as AppBridge from '../AppBridgePlatformApp.ts';
import { type AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

import { appUserState } from './appUserState.ts';

describe('appUserState', () => {
    it('should return the userState object and an object setter', () => {
        const setMock = vi.fn();
        vi.spyOn(AppBridge, 'AppBridgePlatformApp').mockImplementationOnce(
            () =>
                ({
                    state: () => ({
                        get: vi.fn().mockImplementation(() => ({ 'test-userState': 'output' })),
                        set: setMock,
                    }),
                }) as unknown as AppBridgePlatformApp,
        );
        const testSetter = { 'test-userState': 'fun' };

        const [userState, setUserState] = appUserState<{
            'test-userState': string;
            'another-settings': string;
        }>();
        expect(userState['test-userState']).toBe('output');

        setUserState(testSetter);
        expect(setMock).toHaveBeenCalledWith(testSetter);
    });
});
