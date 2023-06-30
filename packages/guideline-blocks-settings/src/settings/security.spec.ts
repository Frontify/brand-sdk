/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getSecurityDownloadableSetting, getSecurityGlobalControlSetting } from './security';
import { Security } from './types';

describe('getSecurityGlobalControlSetting', () => {
    it('should return global control setting without id', () => {
        expect(getSecurityGlobalControlSetting()).toEqual({
            id: 'security',
            type: 'segmentedControls',
            defaultValue: Security.Global,
            helperText: 'Change global settings here.',
            choices: [
                {
                    value: Security.Global,
                    label: 'Global Settings',
                },
                {
                    value: Security.Custom,
                    label: 'Custom',
                },
            ],
        });
    });

    it('should return global control setting with custom id', () => {
        expect(getSecurityGlobalControlSetting('customId')).toEqual({
            id: 'customId',
            type: 'segmentedControls',
            defaultValue: Security.Global,
            helperText: 'Change global settings here.',
            choices: [
                {
                    value: Security.Global,
                    label: 'Global Settings',
                },
                {
                    value: Security.Custom,
                    label: 'Custom',
                },
            ],
        });
    });
});

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
