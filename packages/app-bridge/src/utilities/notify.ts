/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { NotifyData, NotifyOptions } from '../types';

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
