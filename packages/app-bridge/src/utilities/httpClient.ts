/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClientError } from '../errors/HttpClientError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
    method: string;
    headers: RequestHeaders;
    body?: string;
    signal?: AbortSignal;
};

type RequestHeaders = {
    'X-CSRF-TOKEN'?: string;
    'Content-Type'?: string;
};

type EndpointResponse<T> = {
    currentPage?: number;
    totalPages?: number;
    data: T;
    success: boolean;
};

type DefaultHttpResponse = Record<string, unknown>;

export type HttpUtilResponse<T> = {
    result: EndpointResponse<T>;
};

const request = async <T>(
    method: HttpMethod,
    url: string,
    data?: Record<never, never>,
    headers?: RequestHeaders,
): Promise<HttpUtilResponse<T>> => {
    const parameters: RequestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...headers,
        },
        ...(data && { body: JSON.stringify(data) }),
    };

    const apiResponse = await window.fetch(`${window.location.origin}${url}`, parameters);
    const apiResponseJson = await apiResponse.json();

    if (!apiResponse.ok) {
        throw new HttpClientError(apiResponseJson, apiResponse.status, apiResponseJson.error);
    }

    return {
        result: apiResponseJson as EndpointResponse<T>,
    };
};

export class HttpClient {
    static getCsrfToken() {
        const tokenElement = document.getElementsByName('x-csrf-token');

        if (tokenElement.length > 0) {
            return (tokenElement[0] as HTMLMetaElement).content;
        }

        return undefined;
    }

    static async get<T = DefaultHttpResponse>(url: string): Promise<HttpUtilResponse<T>> {
        return request<T>('GET', url, '', { 'X-CSRF-TOKEN': this.getCsrfToken() });
    }

    static async post<T = DefaultHttpResponse>(url: string, data?: Record<never, never>): Promise<HttpUtilResponse<T>> {
        return request<T>('POST', url, data, { 'X-CSRF-TOKEN': this.getCsrfToken() });
    }

    static async put<T = DefaultHttpResponse>(url: string, data?: Record<never, never>): Promise<HttpUtilResponse<T>> {
        return request<T>('PUT', url, data, { 'X-CSRF-TOKEN': this.getCsrfToken() });
    }

    static async patch<T = DefaultHttpResponse>(
        url: string,
        data?: Record<never, never>,
    ): Promise<HttpUtilResponse<T>> {
        return request<T>('PATCH', url, data, { 'X-CSRF-TOKEN': this.getCsrfToken() });
    }

    static async delete<T = DefaultHttpResponse>(
        url: string,
        data?: Record<never, never>,
    ): Promise<HttpUtilResponse<T>> {
        return request<T>('DELETE', url, data, { 'X-CSRF-TOKEN': this.getCsrfToken() });
    }
}
