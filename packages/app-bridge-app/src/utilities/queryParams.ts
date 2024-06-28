/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ValidationError } from '../errors';

export type QueryParams = { [key: string]: string };

export const getQueryParameters = (url: string): QueryParams => {
    const paramsToObject = (entries: IterableIterator<[string, string]>) => {
        const result: QueryParams = {};

        for (const [key, value] of entries) {
            result[key] = value;
        }

        return result;
    };

    try {
        const urlObject = new URL(url);
        return paramsToObject(urlObject.searchParams.entries());
    } catch {
        throw new ValidationError(`"${url}" is not a valid url`);
    }
};
