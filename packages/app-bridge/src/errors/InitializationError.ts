/* (c) Copyright Frontify Ltd., all rights reserved. */

export class InitializationError extends Error {
    constructor() {
        super('Initialization failed.');
        this.name = 'InitializationError';
    }
}
