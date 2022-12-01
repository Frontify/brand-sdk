/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Bundle } from '../../src/bundle';
import { describe, expect, test, vi } from 'vitest';
import { presetCustomValue } from '../../src/helpers/presetCustomValue';

const exampleMap: Record<string, string> = {
    small: '10px',
    medium: '20px',
    large: '30px',
};

describe('presetCustomValue', () => {
    test('it should set predefined value to custom size input', () => {
        const SLIDER_ID = 'sliderId';
        const INPUT_ID = 'inputId';

        const bundle: Bundle<unknown> = {
            getBlock(id: string) {
                if (id === SLIDER_ID) {
                    return { value: 'large' };
                } else if (id === INPUT_ID) {
                    return { value: '20px' };
                }
                return null;
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setBlockValue(): void {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
        };

        const setBlockValueSpy = vi.spyOn(bundle, 'setBlockValue');
        presetCustomValue(bundle, SLIDER_ID, INPUT_ID, exampleMap);

        expect(setBlockValueSpy).toHaveBeenCalledWith(INPUT_ID, '30px');
    });

    test('it should not call setBlockValue if a custom size is defined', () => {
        const SLIDER_ID = 'sliderId';
        const INPUT_ID = 'inputId';

        const bundle: Bundle<unknown> = {
            getBlock(id) {
                if (id === SLIDER_ID) {
                    return { value: 'small' };
                } else if (id === INPUT_ID) {
                    return { value: '16px' };
                }
                return null;
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setBlockValue(): void {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
            getAppBridge(): any {},
        };

        const setBlockValueSpy = vi.spyOn(bundle, 'setBlockValue');
        presetCustomValue(bundle, SLIDER_ID, INPUT_ID, exampleMap);

        expect(setBlockValueSpy).not.toHaveBeenCalled();
    });
});
