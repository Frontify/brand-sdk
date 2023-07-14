/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DispatchHandler } from '../types';

export const openAssetViewer = (token: string): DispatchHandler<'openAssetViewer'> => ({
    commandName: 'openAssetViewer',
    options: { token },
});
