/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, beforeAll, describe, expect, it, test, vi } from 'vitest';

import { AppBridgeCreateAsset } from './AppBridgeCreateAsset';
import { Topic } from './types';
import { generateRandomString } from './utilities/hash';
import { notify } from './utilities/notify';
import { subscribe } from './utilities/subscribe';

const TOKEN = 'AjY34F87Dsat^J';
const EXPECTED_RESULT = { test: 'passed' };

const DEFAULT_TIMEOUT = 3 * 1000;
const LONG_TIMEOUT = 5 * 60 * 1000;

describe('AppBridgeCreateAssetTest', () => {
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
        expect(new AppBridgeCreateAsset()).toBeInstanceOf(AppBridgeCreateAsset);
    });

    test('getAppState', async () => {
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.getAppState();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.GetAppState, TOKEN);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.GetAppState, TOKEN);
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('putAppState', async () => {
        const newState = { new: 'state' };
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.putAppState(newState);

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.PutAppState, TOKEN, newState);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.PutAppState, TOKEN);
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('deleteAppState', async () => {
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.deleteAppState();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.DeleteAppState, TOKEN);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.DeleteAppState, TOKEN);
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('getAssetById', async () => {
        const assetId = 4076;
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.getAssetById(assetId);

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.GetAssetById, TOKEN, { assetId });

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.GetAssetById, TOKEN);
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('postExternalAssetWithPreview', async () => {
        const assets = [
            {
                title: 'My external asset',
                url: 'https://www.post-external-asset.test',
                previewUrl: 'https://www.preview-url.test',
            },
            {
                title: 'My external asset',
                url: 'https://www.post-external-asset.test',
                previewUrl: 'https://www.preview-url.test',
            },
        ];
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.postExternalAssets(assets);

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.PostExternalAssets, TOKEN, assets);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.PostExternalAssets, TOKEN, { timeout: LONG_TIMEOUT });
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('postExternalAssetWithoutPreview', async () => {
        const assets = [
            {
                title: 'My external asset',
                url: 'https://www.post-external-asset.test',
            },
            {
                title: 'My external asset',
                url: 'https://www.post-external-asset.test',
            },
        ];
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.postExternalAssets(assets);

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.PostExternalAssets, TOKEN, assets);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.PostExternalAssets, TOKEN, { timeout: DEFAULT_TIMEOUT });
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('getThirdPartyOauth2Tokens', async () => {
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.getThirdPartyOauth2Tokens();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.GetThirdPartyOauth2Tokens, TOKEN);

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.GetThirdPartyOauth2Tokens, TOKEN, {
            timeout: LONG_TIMEOUT,
        });
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('getRefreshedThirdpartyOauth2Tokens', async () => {
        const refreshToken = '8raSsn0nG5v4';
        const appBridge = new AppBridgeCreateAsset();
        const result = appBridge.getRefreshedThirdpartyOauth2Tokens(refreshToken);
        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.GetRefreshedThirdpartyOauth2Token, TOKEN, { refreshToken });

        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith(Topic.GetRefreshedThirdpartyOauth2Token, TOKEN);
        await expect(result).resolves.toEqual(EXPECTED_RESULT);
    });

    test('closeApp', () => {
        const appBridge = new AppBridgeCreateAsset();
        appBridge.closeApp();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.CloseApp, TOKEN);
    });

    test('openAssetChooser', () => {
        const appBridge = new AppBridgeCreateAsset();
        appBridge.openAssetChooser();

        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(Topic.OpenAssetChooser, TOKEN);
    });
});
