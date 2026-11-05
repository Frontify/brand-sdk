/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Nullable } from './Nullable';

export type TrackActions = 'button:clicked';

export type TrackPayload = {
    action: TrackActions;
    payload: Nullable<Record<string, string>>;
};
