/* (c) Copyright Frontify Ltd., all rights reserved. */

export class InitializationError extends Error {
    constructor(message?: string) {
        super(`Initialization failed. ${message}`);
        this.name = 'InitializationError';
    }
}
