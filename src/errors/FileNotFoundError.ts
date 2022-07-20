/* (c) Copyright Frontify Ltd., all rights reserved. */

import Logger from '../utils/logger';

export default class FileNotFoundError extends Error {
    readonly name = 'FileNotFoundError';
    constructor(path: string) {
        super();
        Logger.error(`The file at "${path}" has not been found.`);
    }
}
