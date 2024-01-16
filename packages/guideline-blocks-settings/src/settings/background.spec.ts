/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getBackgroundSettings } from './background';

describe('getBackgroundSettings', () => {
    it('should return background settings without arguments', () => {
        expect(getBackgroundSettings()).toEqual({
            id: 'hasBackground',
            label: 'Background',
            type: 'switch',
            defaultValue: false,
            on: [
                {
                    id: 'backgroundColor',
                    defaultValue: {
                        red: 241,
                        green: 241,
                        blue: 241,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });

    it('should return background settings with id', () => {
        expect(getBackgroundSettings({ id: 'Test' })).toEqual({
            id: 'hasBackgroundTest',
            label: 'Background',
            type: 'switch',
            defaultValue: false,
            on: [
                {
                    id: 'backgroundColorTest',
                    defaultValue: {
                        red: 241,
                        green: 241,
                        blue: 241,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });

    it('should return background settings with default value', () => {
        expect(getBackgroundSettings({ defaultValue: true })).toEqual({
            id: 'hasBackground',
            label: 'Background',
            type: 'switch',
            defaultValue: true,
            on: [
                {
                    id: 'backgroundColor',
                    defaultValue: {
                        red: 241,
                        green: 241,
                        blue: 241,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });

    it('should return background settings with default color', () => {
        expect(getBackgroundSettings({ defaultColor: { red: 0, green: 0, blue: 0, alpha: 1 } })).toEqual({
            id: 'hasBackground',
            label: 'Background',
            type: 'switch',
            defaultValue: false,
            on: [
                {
                    id: 'backgroundColor',
                    defaultValue: {
                        red: 0,
                        green: 0,
                        blue: 0,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });

    it('should return background settings with id, default value and default color', () => {
        expect(
            getBackgroundSettings({
                id: 'Test',
                defaultValue: true,
                defaultColor: { red: 0, green: 0, blue: 0, alpha: 1 },
            }),
        ).toEqual({
            id: 'hasBackgroundTest',
            label: 'Background',
            type: 'switch',
            defaultValue: true,
            on: [
                {
                    id: 'backgroundColorTest',
                    defaultValue: {
                        red: 0,
                        green: 0,
                        blue: 0,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });

    it('should return background settings with switch label', () => {
        expect(getBackgroundSettings({ switchLabel: 'Test' })).toEqual({
            id: 'hasBackground',
            label: 'Background',
            type: 'switch',
            switchLabel: 'Test',
            defaultValue: false,
            on: [
                {
                    id: 'backgroundColor',
                    defaultValue: {
                        red: 241,
                        green: 241,
                        blue: 241,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });
    it('should not return default color if hasDefaultColor is false', () => {
        expect(getBackgroundSettings({ preventDefaultColor: true })).toEqual({
            id: 'hasBackground',
            label: 'Background',
            type: 'switch',
            defaultValue: false,
            on: [
                {
                    id: 'backgroundColor',
                    type: 'colorInput',
                },
            ],
        });
    });
    it('should return default color if hasDefaultColor is true', () => {
        expect(getBackgroundSettings({ preventDefaultColor: false })).toEqual({
            id: 'hasBackground',
            label: 'Background',
            type: 'switch',
            defaultValue: false,
            on: [
                {
                    id: 'backgroundColor',
                    defaultValue: {
                        red: 241,
                        green: 241,
                        blue: 241,
                        alpha: 1,
                    },
                    type: 'colorInput',
                },
            ],
        });
    });
});
