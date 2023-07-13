/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DispatchHandler } from '../types';

export const openAssetViewer = (token: string): DispatchHandler<'openAssetViewer'> => ({
    commandName: 'openAssetViewer',
    options: { token },
});
