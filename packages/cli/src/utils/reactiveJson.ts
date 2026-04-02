/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync, writeFileSync } from 'node:fs';

import FileNotFoundError from '../errors/FileNotFoundError';
import ParseJsonError from '../errors/ParseJsonError';

export const reactiveJson = <T>(path: string): T => {
    try {
        const jsonRaw = readFileSync(path, 'utf8');
        const jsonParsed: T = JSON.parse(jsonRaw) as T;

        return new Proxy(jsonParsed as object, {
            set: (obj: Record<string | symbol, unknown>, prop, value: unknown) => {
                obj[prop] = value;

                const jsonString = JSON.stringify(obj, null, '\t');

                writeFileSync(path, jsonString);

                return true;
            },
        }) as T;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new ParseJsonError(path);
        } else if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            throw new FileNotFoundError(path);
        }

        throw new Error(String(error));
    }
};
