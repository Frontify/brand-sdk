/* (c) Copyright Frontify Ltd., all rights reserved. */

export type PlatformAppProperties = {
    view?: PlatformAppView;
    token?: string;
};

export enum PlatformAppView {
    assetCreation = 'asset-creation',
    assetDetail = 'asset-detail',
}
