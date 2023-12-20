/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync, writeFileSync } from 'node:fs';

import FileNotFoundError from '../errors/FileNotFoundError';
import ParseJsonError from '../errors/ParseJsonError';

export const reactiveJson = <T>(path: string): T => {
    try {
        const jsonRaw = readFileSync(path, 'utf8');
        const jsonParsed = JSON.parse(jsonRaw);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return new Proxy(jsonParsed, {
            set: (obj, prop, value) => {
                obj[prop] = value;

                const jsonString = JSON.stringify(obj, null, '\t');

                writeFileSync(path, jsonString);

                return true;
            },
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new ParseJsonError(path);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((error as any).code === 'ENOENT') {
            throw new FileNotFoundError(path);
        }

        throw new Error(error as string);
    }
};
