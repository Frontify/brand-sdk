/* (c) Copyright Frontify Ltd., all rights reserved. */

import { relativeUrlRegex } from '../components/Link/utils';

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
