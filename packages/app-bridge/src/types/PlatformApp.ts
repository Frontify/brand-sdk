/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Token } from '@frontify/frontify-authenticator';

export type PlatformAppProperties = {
    view?: PlatformAppView;
    token?: Token;
    domain: string;
    clientId: string;
    projectId?: string;
};

export enum PlatformAppView {
    assetCreation = 'asset-creation',
    assetDetail = 'asset-detail',
}
