/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { isDownloadable } from './isDownloadable';
import { Security } from '../settings/types';

describe('isDownloadable', () => {
    it('should return false if global is false and downloadable is false', () => {
        const result = isDownloadable(Security.Global, false, false);
        expect(result).toBeFalsy();
    });

    it('should return true if global is true and downloadable is true', () => {
        const result = isDownloadable(Security.Global, true, true);
        expect(result).toBeTruthy();
    });

    it('should return true if global is true and downloadable is false', () => {
        const result = isDownloadable(Security.Global, false, true);
        expect(result).toBeTruthy();
    });

    it('should return false if global is false and downloadable is true', () => {
        const result = isDownloadable(Security.Global, true, false);
        expect(result).toBeFalsy();
    });

    it('should return true if global is false but its security is custom and downloadable is true ', () => {
        const result = isDownloadable(Security.Custom, true, false);
        expect(result).toBeTruthy();
    });

    it('should return false if global is true but its security is custom and downloadable is false ', () => {
        const result = isDownloadable(Security.Custom, false, true);
        expect(result).toBeFalsy();
    });

    it('should return false if global is true but its security is custom and downloadable is false ', () => {
        const result = isDownloadable(Security.Custom, false, false);
        expect(result).toBeFalsy();
    });

    it('should return true if global is true but its security is custom and downloadable is false ', () => {
        const result = isDownloadable(Security.Custom, true, true);
        expect(result).toBeTruthy();
    });
});
