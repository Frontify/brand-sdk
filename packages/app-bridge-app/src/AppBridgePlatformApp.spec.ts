/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { AppBridgePlatformApp } from './AppBridgePlatformApp';
import { InitializationError } from './errors';
import { openConnection } from './registries/commands.ts';
import { notify } from './utilities';

const TOKEN = 'AjY34F87Dsat^J';

describe('AppBridgePlatformApp', () => {
    vi.mock('./utilities/subscribe', () => ({
        subscribe: vi.fn().mockResolvedValue({
            statePort: { onmessage: vi.fn() },
            apiPort: { onmessage: vi.fn() },
            context: { parentId: 'parentId-test', connected: true },
            state: { settings: 'settings-test', userState: 'state-test' },
        }),
    }));

    vi.mock('./utilities/notify', () => ({
        notify: vi.fn(),
    }));

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgePlatformApp()).toBeInstanceOf(AppBridgePlatformApp);
    });

    it('should not initialize without a token', async () => {
        window.location.search = '?token=';

        const platformApp = new AppBridgePlatformApp();

        await expect(() => platformApp.dispatch(openConnection())).rejects.toThrow(new InitializationError());
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('should yield true for Context.connected after dispatch', async () => {
        const connected = true;
        window.location.search = `?token=${TOKEN}`;
        const platformApp = new AppBridgePlatformApp();
        platformApp.subscribe('Context.connected', () => {
            expect(connected).toBe(true);
        });
        platformApp.dispatch(openConnection());
    });

    it('should return empty state when not inititalized', async () => {
        const platformApp = new AppBridgePlatformApp();
        const state = platformApp.state().get();
        expect(state).toEqual({ settings: 'settings-test', userState: 'state-test' });
    });

    it('should return state after app is initialized', async () => {
        window.location.search = `?token=${TOKEN}`;
        const platformApp = new AppBridgePlatformApp();
        platformApp.subscribe('Context.connected', (connected: boolean) => {
            const state = platformApp.state().get();

            expect(connected).toBe(true);
            expect(state).toEqual({ settings: 'settings-test' });
        });
        platformApp.dispatch(openConnection());
    });

    it('should yield true for Context.connected after dispatch', async () => {
        window.location.search = `?token=${TOKEN}`;
        const platformApp = new AppBridgePlatformApp();
        platformApp.subscribe('Context.connected', (connected: boolean) => {
            const context = platformApp.context().get();
            const parentId = platformApp.context('parentId').get();

            expect(connected).toBe(true);
            expect(context).toEqual({ parentId: 'parentId-test', connected: true });
            expect(parentId).toEqual('parentId-test');
        });
        platformApp.dispatch(openConnection());
    });
});
