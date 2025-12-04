/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, it, vi, expect } from 'vitest';

import { AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

import { appSettings } from './appSettings.ts';

vi.mock(import('../AppBridgePlatformApp.ts'));

describe('appSettings', () => {
    it('should return the settings object and an object setter', () => {
        const setMock = vi.fn();
        vi.mocked(AppBridgePlatformApp).mockImplementationOnce(function () {
            return {
                state: () => ({
                    get: vi.fn().mockImplementation(() => ({ 'test-settings': 'output' })),
                    set: setMock,
                }),
            } as unknown as AppBridgePlatformApp;
        });
        const testSetter = { 'test-settings': 'fun' };

        const [settings, setSettings] = appSettings<{
            'test-settings': string;
            'another-settings': string;
        }>();
        expect(settings['test-settings']).toBe('output');

        setSettings(testSetter);
        expect(setMock).toHaveBeenCalledWith(testSetter);
    });
});
