/* (c) Copyright Frontify Ltd., all rights reserved. */

import { addHttps } from '../../../helpers';
import { relativeUrlRegex } from './relativeUrlRegex';

export const isValidUrl = (url: string) => {
    if (relativeUrlRegex.test(url)) {
        return true;
    }
    try {
        const parsedUrl = new URL(url);
        const validProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
        return validProtocols.includes(parsedUrl.protocol) && parsedUrl.pathname !== '';
    } catch (error) {
        return false;
    }
};

export const isValidUrlOrEmpty = (url: string): boolean => {
    return isValidUrl(addHttps(url)) || url === '';
};
