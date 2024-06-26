/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, it, vi, expect } from 'vitest';

import * as AppBridge from '../AppBridgePlatformApp.ts';
import { type AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

import { appSettings } from './appSettings.ts';

describe('appSettings', () => {
    it('should call the subscribe method and then render the test Component correctly when callback called', () => {
        const setMock = vi.fn();
        vi.spyOn(AppBridge, 'AppBridgePlatformApp').mockImplementationOnce(
            () =>
                ({
                    state: () => ({
                        get: vi.fn().mockImplementation(() => ({ 'test-settings': 'output' })),
                        set: setMock,
                    }),
                }) as unknown as AppBridgePlatformApp,
        );
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
