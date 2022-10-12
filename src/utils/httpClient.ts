/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Response, fetch } from 'undici';

interface RequestOptions {
    headers?: Record<string, string>;
}

interface FetchParameters {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    body?: Record<string, unknown>;
    options?: RequestOptions;
}

export class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/^https?:\/\//, '');
    }

    private async fetchExtended<T>({ method, url, body, options }: FetchParameters): Promise<T> {
        const response: Response = await fetch(this.getAbsoluteUrl(url), {
            method,
            ...(body && {
                body: JSON.stringify(body),
            }),
            ...options,
            headers: { 'Content-Type': 'application/json', ...options?.headers },
        });

        if (response.status === 200) {
            const contentType = response.headers.get('Content-Type');

            switch (contentType) {
                case 'application/json':
                    return (await response.json()) as T;
                default:
                    const responseText = await response.text();
                    return responseText as T;
            }
        } else {
            const errorData = await response.text();
            throw new Error(errorData);
        }
    }

    public get<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.fetchExtended<T>({ url, method: 'GET', options });
    }

    public post<T>(url: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: 'POST', body, options });
    }

    public put<T>(url: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: 'PUT', body, options });
    }

    public delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: 'DELETE', options });
    }

    private getAbsoluteUrl(relativeUrl: string): string {
        console.log(`https://${this.baseUrl}${relativeUrl}`);
        return `https://${this.baseUrl}${relativeUrl}`;
    }
}
