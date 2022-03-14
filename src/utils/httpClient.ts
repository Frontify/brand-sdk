import fetch, { Headers, Response } from 'node-fetch';
import https from 'https';

interface RequestOptions {
    headers?: Headers;
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
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const headers = new Headers({
            ...(body && {
                'Content-Type': 'application/json',
            }),
        });

        if (options?.headers) {
            for (const header of options.headers.entries()) {
                headers.append(header[0], header[1]);
            }
        }

        const response: Response = await fetch(this.getAbsoluteUrl(url), {
            method,
            ...(body && {
                body: JSON.stringify(body),
            }),
            agent,
            ...options,
            headers,
        });

        try {
            if (response.status === 200) {
                const contentType = response.headers.get('Content-Type');

                switch (contentType) {
                    case 'application/json':
                        return await response.json();
                    default:
                        const responseText = await response.text();
                        return responseText || undefined;
                }
            } else {
                const errorData = await response.text();
                throw new Error(errorData);
            }
        } catch (error) {
            throw new Error(error as string);
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
