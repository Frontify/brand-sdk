/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test, vi } from 'vitest';
import type { Bundle } from '../../src/bundle';
import { appendUnit } from '../../src/helpers/appendUnit';

describe('appendUnit', () => {
    test('it should set correct value with "px" when entering a number', () => {
        const bundle: Bundle<unknown> = {
            getBlock() {
                return { value: 20 };
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setBlockValue(): void {},
        };

        const setBlockValueSpy = vi.spyOn(bundle, 'setBlockValue');
        appendUnit(bundle, 'my_setting_id');

        expect(setBlockValueSpy).toHaveBeenCalledWith('my_setting_id', '20px');
    });

    test('it should set correct value with "%" when entering a number', () => {
        const bundle: Bundle<unknown> = {
            getBlock() {
                return { value: 40 };
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setBlockValue(): void {},
        };

        const setBlockValueSpy = vi.spyOn(bundle, 'setBlockValue');
        appendUnit(bundle, 'my_setting_id', '%');

        expect(setBlockValueSpy).toHaveBeenCalledWith('my_setting_id', '40%');
    });

    test('it should not call setBlockValue when entering a px-value', () => {
        const bundle: Bundle<unknown> = {
            getBlock() {
                return { value: '20px' };
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setBlockValue(): void {},
        };
        const setBlockValueSpy = vi.spyOn(bundle, 'setBlockValue');
        appendUnit(bundle, 'my_setting_id');
        expect(setBlockValueSpy).not.toHaveBeenCalledWith('my_setting_id', '20px');
    });

    test('it should handle undefined', () => {
        const bundle: Bundle<unknown> = {
            getBlock() {
                return { value: undefined };
            },
            setBlockValue: vi.fn(),
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
        };
        appendUnit(bundle, 'my_setting_id');
        expect(bundle.setBlockValue).not.toHaveBeenCalled();
    });

    test('it should handle empty string', () => {
        const bundle: Bundle<unknown> = {
            getBlock() {
                return { value: '' };
            },
            setBlockValue: vi.fn(),
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
        };
        appendUnit(bundle, 'my_setting_id');
        expect(bundle.setBlockValue).not.toHaveBeenCalled();
    });
});
