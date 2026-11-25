/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, vi } from 'vitest';

import { closeColorChooser, openColorChooser } from './ColorChooser';

describe('ColorChooser', () => {
    it('should return the open command name and payload', () => {
        const payload = {
            element: document.createElement('div'),
            color: { red: 255, green: 0, blue: 0, alpha: 1 },
            onColorSelect: vi.fn(),
        };
        const command = openColorChooser(payload);

        expect(command.name).toBe('openColorChooser');
        expect(command.payload).toStrictEqual(payload);
    });

    it('should return the close command name and payload', () => {
        const payload = { element: document.createElement('div') };
        const command = closeColorChooser(payload);

        expect(command.name).toBe('closeColorChooser');
        expect(command.payload).toStrictEqual(payload);
    });
});
