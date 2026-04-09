/* (c) Copyright Frontify Ltd., all rights reserved. */

export class HttpClientError extends Error {
    public code = 0;
    public responseBody: { success: false; error: string };

    constructor(code: number, responseBody: { success: false; error: string }) {
        super(`Status code ${code}`);
        this.name = 'HttpClientError';
        this.code = code;
        this.responseBody = responseBody;
    }
}
