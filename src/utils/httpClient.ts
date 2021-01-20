import fetch, { Headers, Response } from "node-fetch";
import https from "https";

interface RequestOptions {
    headers?: Headers;
}

interface FetchParameters {
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: string;
    body?: Record<string, unknown> | string;
    options?: RequestOptions;
}

export class HttpClient {
    constructor(private readonly baseUrl: string = "") {}

    private async fetchExtended({ method, url, body, options }: FetchParameters) {
        const agent = new https.Agent({
            rejectUnauthorized: process.env.NODE_ENV !== "development",
        });

        const response: Response = await fetch(this.getAbsoluteUrl(url), {
            method,
            ...options,
            ...(body && {
                body: typeof body === "string" ? body : JSON.stringify(body),
            }),
            agent,
        });

        try {
            if (response.status === 200) {
                return await response.json();
            } else {
                const errorData = await response.json();
                throw errorData;
            }
        } catch (error) {
            throw error;
        }
    }

    public get<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: "GET", options });
    }

    public post<T>(url: string, body?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: "POST", body, options });
    }

    public put<T>(url: string, body: Record<string, unknown>, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: "PUT", body, options });
    }

    public delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.fetchExtended({ url, method: "DELETE", options });
    }

    public getAbsoluteUrl(relativeUrl = "/"): string {
        return `${this.baseUrl}${relativeUrl}`;
    }
}
