/* (c) Copyright Frontify Ltd., all rights reserved. */

export class ValidationError extends Error {
    constructor(message?: string) {
        super(`Validation failed. ${message}`);
        this.name = 'ValidationError';
    }
}
