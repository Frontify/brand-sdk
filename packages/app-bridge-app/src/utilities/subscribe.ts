/* (c) Copyright Frontify Ltd., all rights reserved. */

import { FetchError, TimeoutReachedError } from '../errors';
import { type CrossDocumentMessageResponse } from '../types/CrossDocumentMessageResponse.ts';
import { type Topic } from '../types/Topic.ts';

export type SubscribeOptions = {
    timeout?: number;
};

export const SUBSCRIBE_TIMEOUT = 3 * 1000;

export function subscribe<T>(topic: Topic, token: string, options?: SubscribeOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const subscribeResponseCallback = (event: MessageEvent) => {
            const response: CrossDocumentMessageResponse<T> = event.data;

            if (response.token === token && response.topic === topic && response.success) {
                resolve(<T>(response.data || true));
            } else {
                reject(new FetchError(topic));
            }

            window.removeEventListener('message', subscribeResponseCallback);
        };

        window.addEventListener('message', subscribeResponseCallback);

        setTimeout(() => {
            reject(new TimeoutReachedError(topic));
        }, options?.timeout || SUBSCRIBE_TIMEOUT);
    });
}
