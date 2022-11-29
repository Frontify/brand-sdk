/* (c) Copyright Frontify Ltd., all rights reserved. */

export default class CompilationFailedError extends Error {
    readonly name = 'CompilationFailedError';
    constructor(error: string) {
        super(error);
    }
}
