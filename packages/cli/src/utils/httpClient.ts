/* (c) Copyright Frontify Ltd., all rights reserved. */

import fetch from 'node-fetch';
import { HttpClientError } from '../errors/HttpClientError.js';

interface RequestOptions {
    headers?: {
        Authorization?: string;
    };
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
        const response = await fetch(this.getAbsoluteUrl(url), {
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
                    const responseJson = await response.json();
                    if (!responseJson) {
                        return undefined as T;
                    }
                    return responseJson as T;
                default:
                    const responseText = await response.text();
                    if (!responseText) {
                        return undefined as T;
                    }
                    return responseText as T;
            }
        } else {
            const errorData = (await response.json()) as { sucess: false; error: string };
            throw new HttpClientError(response.status, errorData);
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
        return `https://${this.baseUrl}${relativeUrl}`;
    }
}
