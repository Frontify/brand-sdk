/* (c) Copyright Frontify Ltd., all rights reserved. */

export class HttpClientError extends Error {
    public code = 0;
    public responseBody: object;

    constructor(message: string, code: number, responseBody: Record<string, unknown>) {
        super(`Status code ${code} - ${message}`);
        this.name = 'HttpClientError';
        this.code = code;
        this.responseBody = responseBody;
    }
}
