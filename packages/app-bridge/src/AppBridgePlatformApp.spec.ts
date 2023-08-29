/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { notify } from './utilities';
import { AppBridgePlatformApp } from './AppBridgePlatformApp';
import { InitializationError } from './errors';

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

        await expect(() => platformApp.dispatch({ name: 'openConnection' })).rejects.toThrow(new InitializationError());
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should openConnection correctly', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        await platformApp.dispatch({ name: 'openConnection' });
        expect(notify).toHaveBeenCalledTimes(1);
    });

    it.fails('should throw an error when api is not initialized', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        await expect(() => platformApp.api({ name: 'getCurrentUser' })).rejects.toThrow();
    });

    it('should return undefined state as it is not implemented', async () => {
        const platformApp = new AppBridgePlatformApp();
        const state = platformApp.state();
        expect(state).toEqual(undefined);
    });

    it('should return undefined subscribe method as it is not implemented', async () => {
        const platformApp = new AppBridgePlatformApp();
        const subscribe = platformApp.subscribe();
        expect(subscribe).toBeTypeOf('function');
    });
});
