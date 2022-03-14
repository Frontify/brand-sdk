import Logger from '../utils/logger';

export default class InvalidInstanceUrlError extends Error {
    readonly name = 'InvalidInstanceUrlError';
    constructor(url: string) {
        super();
        if (url) {
            Logger.error(`The given url "${url}" is invalid.`);
        } else {
            Logger.error('No instance URL was given.');
        }
    }
}
