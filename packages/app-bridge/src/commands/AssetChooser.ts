/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOptions, DispatchHandler } from '../types';

export const openAssetChooser = (options: AssetChooserOptions): DispatchHandler<'AssetChooser.Open'> => ({
    commandName: 'AssetChooser.Open',
    options,
});

export const closeAssetChooser = (): DispatchHandler<'AssetChooser.Close'> => ({
    commandName: 'AssetChooser.Close',
});
