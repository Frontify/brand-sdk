/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getSecurityDownloadableSetting } from './securityDownloadable';

describe('getSecurityDownloadableSetting', () => {
    it('should return downloadable setting without arguments', () => {
        expect(getSecurityDownloadableSetting()).toEqual({
            id: 'downloadable',
            type: 'switch',
            defaultValue: false,
            label: 'Downloadable',
            show: expect.any(Function),
        });
    });

    it('should return downloadable setting with custom id', () => {
        expect(getSecurityDownloadableSetting({ id: 'customId' })).toEqual({
            id: 'customId',
            type: 'switch',
            defaultValue: false,
            label: 'Downloadable',
            show: expect.any(Function),
        });
    });

    it('should return downloadable setting with custom global control id', () => {
        expect(getSecurityDownloadableSetting({ globalControlId: 'globalCustomId' })).toEqual({
            id: 'downloadable',
            type: 'switch',
            defaultValue: false,
            label: 'Downloadable',
            show: expect.any(Function),
        });
    });

    it('should return downloadable setting with custom id and global control id', () => {
        expect(getSecurityDownloadableSetting({ id: 'customId', globalControlId: 'globalCustomId' })).toEqual({
            id: 'customId',
            type: 'switch',
            defaultValue: false,
            label: 'Downloadable',
            show: expect.any(Function),
        });
    });
});
