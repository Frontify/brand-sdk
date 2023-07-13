/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOptions, DispatchHandler } from '../types';

export const openAssetChooser = (options?: AssetChooserOptions): DispatchHandler<'openAssetChooser'> => ({
    commandName: 'openAssetChooser',
    options,
});

export const closeAssetChooser = (): DispatchHandler<'closeAssetChooser'> => ({
    commandName: 'closeAssetChooser',
});

export const openAssetViewer = (token: string): DispatchHandler<'AssetViewer.Open'> => ({
    commandName: 'AssetViewer.Open',
    options: { token },
});
