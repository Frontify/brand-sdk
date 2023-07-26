/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DispatchHandler } from '../types';
import { TrackAssetDownload } from '../types/Analytics';

export const trackPlatformAnalytics = (payload: TrackAssetDownload): DispatchHandler<'trackPlatformAnalytics'> => {
    return {
        name: 'trackPlatformAnalytics',
        payload,
    };
};
