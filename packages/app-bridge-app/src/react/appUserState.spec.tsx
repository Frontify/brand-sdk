/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, it, vi, expect } from 'vitest';

import { AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

import { appUserState } from './appUserState.ts';

vi.mock(import('../AppBridgePlatformApp.ts'));

describe('appUserState', () => {
    it('should return the userState object and an object setter', () => {
        const setMock = vi.fn();
        vi.mocked(AppBridgePlatformApp).mockImplementationOnce(function () {
            return {
                state: () => ({
                    get: vi.fn().mockImplementation(() => ({ 'test-userState': 'output' })),
                    set: setMock,
                }),
            } as unknown as AppBridgePlatformApp;
        });
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
