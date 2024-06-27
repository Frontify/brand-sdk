/* (c) Copyright Frontify Ltd., all rights reserved. */

export class TimeoutReachedError extends Error {
    constructor(topic: string) {
        super(`Timeout for call with topic "${topic}" expired. Call was aborted.`);
        this.name = 'TimeoutReachedError';
    }
}
