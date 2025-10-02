/* (c) Copyright Frontify Ltd., all rights reserved. */

export type TrackActions = 'button:clicked';

export type TrackPayload = {
    action: TrackActions;
    payload: Nullable<Record<string, string>>;
};
