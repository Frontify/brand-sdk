/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserOptions, DispatchHandler } from '../types';

export const openAssetChooser = (options?: AssetChooserOptions): DispatchHandler<'openAssetChooser'> => ({
    name: 'openAssetChooser',
    options,
});

export const closeAssetChooser = (): DispatchHandler<'closeAssetChooser'> => ({
    name: 'closeAssetChooser',
});
