/* (c) Copyright Frontify Ltd., all rights reserved. */

import { URL } from 'url';
import InvalidInstanceUrlError from '../errors/InvalidInstanceUrlError';

export const getValidInstanceUrl = (url: string): string => {
    try {
        const cleanHost = url.replace(/^https?:\/\//, '');
        const parsedUrl = new URL(`https://${cleanHost}`);
        //TODO: Maybe change it so it has http (as it will be automatically redirected)
        return parsedUrl.hostname;
    } catch {
        throw new InvalidInstanceUrlError(url);
    }
};
