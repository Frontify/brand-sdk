/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { notify } from './utilities';
import { AppBridgePlatformApp } from './AppBridgePlatformApp';
import { InitializationError } from './errors/InitializationError';

const TOKEN = 'AjY34F87Dsat^J';

describe('AppBridgePlatformApp', () => {
    beforeAll(() => {
        vi.mock('./utilities/subscribe', () => ({
            subscribe: vi.fn().mockResolvedValue({ test: 'passed' }),
        }));

        vi.mock('./utilities/notify', () => ({
            notify: vi.fn(),
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgePlatformApp()).toBeInstanceOf(AppBridgePlatformApp);
    });

    it('should not initialize without a token', async () => {
        window.location.search = '?token=';

        const platformApp = new AppBridgePlatformApp();

        await expect(() => platformApp.initialize()).rejects.toThrow(new InitializationError());
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should initialize correctly', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        await platformApp.initialize();
        expect(notify).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when api is not initialized', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        await expect(() => platformApp.api({ operation: 'currentUser' })).rejects.toThrow(
            new InitializationError('First use await appBridge.initialize()'),
        );
    });
});
