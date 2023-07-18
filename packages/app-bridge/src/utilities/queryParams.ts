/* (c) Copyright Frontify Ltd., all rights reserved. */

export type QueryParams = { [key: string]: string };

export const getQueryParameters = (url?: string | null): QueryParams => {
    const params: QueryParams = {};

    const queryString = url?.split('?')[1];
    if (!queryString) {
        return params;
    }

    const keyValuePairs = queryString.split('&');
    for (const pair of keyValuePairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
            params[key] = value;
        }
    }

    return params;
};
