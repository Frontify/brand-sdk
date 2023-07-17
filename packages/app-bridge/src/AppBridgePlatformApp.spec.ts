/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { generateRandomString, notify } from './utilities';
import { AppBridgePlatformApp } from './AppBridgePlatformApp';

const TOKEN = 'AjY34F87Dsat^J';

describe('AppBridgePlatformApp', () => {
    beforeAll(() => {
        vi.mock('./utilities/subscribe', () => {
            return {
                subscribe: vi.fn().mockResolvedValue({ test: 'passed' }),
            };
        });

        vi.mock('./utilities/hash', () => {
            return {
                generateRandomString: vi.fn().mockReturnValue('AjY34F87Dsat^J'),
            };
        });

        vi.mock('./utilities/notify', () => {
            return {
                notify: vi.fn(),
            };
        });

        expect(generateRandomString).toHaveBeenCalledTimes(1);
        expect(generateRandomString).toHaveReturnedWith('AjY34F87Dsat^J');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgePlatformApp()).toBeInstanceOf(AppBridgePlatformApp);
    });

    it('Should not initialize without a token and be falsy', async () => {
        window.location.search = '?token=';

        const platformApp = new AppBridgePlatformApp();
        const output = await platformApp.initialize();

        expect(output.success).toBeFalsy();
        expect(notify).toHaveBeenCalledTimes(0);
    });

    it('Should initialize correctly', async () => {
        window.location.search = `?token=${TOKEN}`;

        const platformApp = new AppBridgePlatformApp();
        const output = await platformApp.initialize();
        expect(notify).toHaveBeenCalledTimes(1);
        expect(output.success).toBeTruthy();
    });

    it('Should throw an error when calling post without initialization', async () => {
        window.location.search = `?token=${TOKEN}`;

        try {
            const platformApp = new AppBridgePlatformApp();
            await platformApp.api({ name: 'currentUser' });
        } catch (error) {
            expect(notify).toHaveBeenCalledTimes(0);
            expect(error).toBeDefined();
        }
    });
});
