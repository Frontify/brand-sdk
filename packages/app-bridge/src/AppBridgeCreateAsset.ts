/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetApi, OauthTokens, PostExternalAssetParams } from './types';
import { Topic } from './types';
import { generateRandomString } from './utilities/hash';
import { NotifyData, notify } from './utilities/notify';
import { subscribe } from './utilities/subscribe';

const PUBSUB_TOKEN = generateRandomString();
const DEFAULT_TIMEOUT = 3 * 1000;
const LONG_TIMEOUT = 5 * 60 * 1000;

export class AppBridgeCreateAsset {
    getAppState<T = Record<string, unknown>>(): Promise<T> {
        notify(Topic.GetAppState, PUBSUB_TOKEN);
        return subscribe<T>(Topic.GetAppState, PUBSUB_TOKEN);
    }

    async putAppState(newState: NotifyData): Promise<boolean> {
        notify(Topic.PutAppState, PUBSUB_TOKEN, newState);
        return subscribe<boolean>(Topic.PutAppState, PUBSUB_TOKEN);
    }

    async deleteAppState(): Promise<boolean> {
        notify(Topic.DeleteAppState, PUBSUB_TOKEN);
        return subscribe<boolean>(Topic.DeleteAppState, PUBSUB_TOKEN);
    }

    getAssetById(assetId: number): Promise<AssetApi> {
        notify(Topic.GetAssetById, PUBSUB_TOKEN, { assetId });
        return subscribe<AssetApi>(Topic.GetAssetById, PUBSUB_TOKEN);
    }

    async postExternalAssets(assets: PostExternalAssetParams[]): Promise<AssetApi[]> {
        const assetsWithPreview = assets.filter((asset) => asset.previewUrl);
        const timeout = assetsWithPreview.length > 0 ? LONG_TIMEOUT : DEFAULT_TIMEOUT;

        notify<PostExternalAssetParams[]>(Topic.PostExternalAssets, PUBSUB_TOKEN, assets);
        return subscribe<AssetApi[]>(Topic.PostExternalAssets, PUBSUB_TOKEN, {
            timeout,
        });
    }

    getThirdPartyOauth2Tokens(): Promise<OauthTokens> {
        notify(Topic.GetThirdPartyOauth2Tokens, PUBSUB_TOKEN);
        return subscribe<OauthTokens>(Topic.GetThirdPartyOauth2Tokens, PUBSUB_TOKEN, {
            timeout: LONG_TIMEOUT,
        });
    }

    getRefreshedThirdpartyOauth2Tokens(refreshToken: string): Promise<OauthTokens> {
        notify(Topic.GetRefreshedThirdpartyOauth2Token, PUBSUB_TOKEN, { refreshToken });
        return subscribe<OauthTokens>(Topic.GetRefreshedThirdpartyOauth2Token, PUBSUB_TOKEN);
    }

    closeApp(): void {
        notify(Topic.CloseApp, PUBSUB_TOKEN);
    }

    openAssetChooser(): void {
        notify(Topic.OpenAssetChooser, PUBSUB_TOKEN);
    }
}
