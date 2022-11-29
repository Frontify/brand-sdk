/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger } from '../utils/logger';

export default class ParseJsonError extends Error {
    readonly name = 'ParseJsonError';
    constructor(path: string) {
        super();
        Logger.error(`The file at "${path}" could not be parsed.`);
    }
}
