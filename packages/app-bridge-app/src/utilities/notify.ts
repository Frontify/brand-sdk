/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type NotifyData, type NotifyOptions } from '../types/Notify.ts';

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
