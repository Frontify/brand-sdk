/* (c) Copyright Frontify Ltd., all rights reserved. */

/**
 * @deprecated Will be removed in 5.0.0, together with `HttpClient`.
 */
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
