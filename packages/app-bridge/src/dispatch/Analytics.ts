/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TrackAssetDownload, TrackingEventName } from '../types/Analytics';

export const trackPlatformAnalytics = <EventName extends TrackingEventName>(
    eventName: EventName,
    payload: TrackAssetDownload,
) => {
    return {
        name: 'trackPlatformAnalytics',
        payload,
    };
};
