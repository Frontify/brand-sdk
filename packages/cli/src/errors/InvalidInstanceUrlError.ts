/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger } from '../utils/logger.js';

export default class InvalidInstanceUrlError extends Error {
    readonly name = 'InvalidInstanceUrlError';
    constructor(url: string) {
        super();
        if (url) {
            Logger.error(`The given URL "${url}" is invalid.`);
        } else {
            Logger.error('No instance URL was given.');
        }
    }
}
