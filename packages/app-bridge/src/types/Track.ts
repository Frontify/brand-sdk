export type TrackActions = 'button:clicked';

export type TrackPayload = {
    action: TrackActions;
    payload: Record<string, unknown>;
};
