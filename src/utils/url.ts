/* (c) Copyright Frontify Ltd., all rights reserved. */

import { URL } from 'node:url';
import InvalidInstanceUrlError from '../errors/InvalidInstanceUrlError';

export const getValidInstanceUrl = (url: string): string => {
    try {
        const cleanHost = url.replace(/^https?:\/\//, '');
        const parsedUrl = new URL(`https://${cleanHost}`);
        return parsedUrl.hostname;
    } catch {
        throw new InvalidInstanceUrlError(url);
    }
};
