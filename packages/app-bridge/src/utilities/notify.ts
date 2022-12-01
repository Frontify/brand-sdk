/* (c) Copyright Frontify Ltd., all rights reserved. */

export type NotifyOptions = {
    origin?: string;
};

export type NotifyData<T = Record<string, unknown>> = T;

export function notify<T>(topic: string, token: string, data?: NotifyData<T>, options?: NotifyOptions): void {
    const parentWindow = window.top;
    parentWindow?.postMessage(
        {
            topic,
            token,
            data,
        },
        options?.origin || '*',
    );
}
