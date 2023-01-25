/* (c) Copyright Frontify Ltd., all rights reserved. */

const TOKEN = 'AjY34F87Dsat^J';

import { afterEach, beforeAll, describe, expect, it, test, vi } from 'vitest';
import { AppBridgeCreateAsset } from './AppBridgeCreateAsset';
import { Topic } from './types';
import { notify } from './utilities/notify';
import { subscribe } from './utilities/subscribe';
import { generateRandomString } from './utilities/hash';

const EXPECTED_RESULT = { test: 'passed' };

const DEFAULT_TIMEOUT = 3 * 1000;
const LONG_TIMEOUT = 5 * 60 * 1000;

describe('AppBridgeCreateAssetTest', () => {
    beforeAll(() => {
        vi.mock('./utilities/subscribe', () => {
            return {
                subscribe: vi.fn(() => Promise.resolve(EXPECTED_RESULT)),
            };
        });

        vi.mock('./utilities/hash', () => {
            return {
                generateRandomString: vi.fn(() => TOKEN),
            };
        });

        vi.mock('./utilities/notify', () => {
            return {
                notify: vi.fn(),
            };
        });

        expect(generateRandomString).toHaveBeenCalledTimes(1);
        expect(generateRandomString).toHaveReturnedWith(TOKEN);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be instantiable', () => {
        expect(new AppBridgeCreateAsset()).toBeInstanceOf(AppBridgeCreateAsset);
    });

    test('getAppState', () => {
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.getAppState();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.GetAppState, TOKEN);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.GetAppState, TOKEN);
        expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('putAppState', () => {
        const newState = { new: 'state' };
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.putAppState(newState);

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.PutAppState, TOKEN, newState);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.PutAppState, TOKEN);
        expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('deleteAppState', () => {
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.deleteAppState();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.DeleteAppState, TOKEN);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.DeleteAppState, TOKEN);
        expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('closeApp', () => {
        const appBridge = new AppBridgeCreateAsset();
        appBridge.closeApp();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.CloseApp, TOKEN);
    });
});
