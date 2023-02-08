/* (c) Copyright Frontify Ltd., all rights reserved. */

export class HttpClientError extends Error {
    public code = 0;
    public responseBody: { sucess: false; error: string };

    constructor(code: number, responseBody: { sucess: false; error: string }) {
        super(`Status code ${code}`);
        this.name = 'HttpClientError';
        this.code = code;
        this.responseBody = responseBody;
    }
}
