/* (c) Copyright Frontify Ltd., all rights reserved. */

import { relativeUrlRegex } from './relativeUrlregex';

export const addHttps = (url: string) => {
    if (relativeUrlRegex.test(url)) {
        return url;
    }
    try {
        new URL(url);
        return url;
    } catch {
        return `https://${url}`;
    }
};
