/* (c) Copyright Frontify Ltd., all rights reserved. */

type AppBaseProps = {
    token: string;
    marketplaceServiceAppId: string;
};

export type PlatformAppContext = AppBaseProps & {
    assetId: string;
    parentId: string;
    directory: string;
    domain: string;
    type: 'ASSET_ACTION';
    parameters: { [key: string]: unknown }[];
};
