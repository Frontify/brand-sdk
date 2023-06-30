/* (c) Copyright Frontify Ltd., all rights reserved. */

import { joinClassNames } from './joinClassNames';
import { describe, expect, test } from 'vitest';

describe('joinClassNames', () => {
    const data = [
        { classes: ['lorem', undefined, false], expected: 'lorem' },
        { classes: ['lorem', 'ipsum'], expected: 'lorem ipsum' },
        { classes: ['lorem', ''], expected: 'lorem' },
        { classes: ['lorem', ' '], expected: 'lorem  ' },
        { classes: [], expected: '' },
    ];

    test.each(data)('validate correctly values', ({ classes, expected }) => {
        expect(joinClassNames(classes)).toBe(expected);
    });
});
