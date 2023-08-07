/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, it } from 'vitest';
import { KeyboardCode, KeyboardCoordinateGetter, SensorContext } from '@dnd-kit/core';
import { customCoordinatesGetterFactory } from './customCoordinatesGetterFactory';

/**
 * @vitest-environment happy-dom
 */
describe('customCoordinatesGetterFactory', () => {
    const initialCoordinates = { x: 0, y: 0 };
    const context = {
        activeNode: {
            offsetWidth: 100,
            offsetHeight: 200,
        },
    } as SensorContext;

    const active = 'mock-active-id';
    let customCoordinatesGetter: KeyboardCoordinateGetter;
    beforeEach(() => {
        customCoordinatesGetter = customCoordinatesGetterFactory(10, 20);
    });

    it('should respond to ArrowRight', () => {
        const result = customCoordinatesGetter(new KeyboardEvent(KeyboardCode.Right, { code: KeyboardCode.Right }), {
            active,
            currentCoordinates: initialCoordinates,
            context,
        });
        expect(result).toEqual({ x: 110, y: 0 });
    });

    it('should respond to ArrowLeft', () => {
        const result = customCoordinatesGetter(new KeyboardEvent(KeyboardCode.Left, { code: KeyboardCode.Left }), {
            active,
            currentCoordinates: initialCoordinates,
            context,
        });
        expect(result).toEqual({ x: -110, y: 0 });
    });

    it('should respond to ArrowDown', () => {
        const result = customCoordinatesGetter(new KeyboardEvent(KeyboardCode.Down, { code: KeyboardCode.Down }), {
            active,
            currentCoordinates: initialCoordinates,
            context,
        });
        expect(result).toEqual({ x: 0, y: 220 });
    });

    it('should respond to ArrowUp', () => {
        const result = customCoordinatesGetter(new KeyboardEvent(KeyboardCode.Up, { code: KeyboardCode.Up }), {
            active,
            currentCoordinates: initialCoordinates,
            context,
        });
        expect(result).toEqual({ x: 0, y: -220 });
    });

    it('should return undefined for other keys', () => {
        const result = customCoordinatesGetter(new KeyboardEvent(KeyboardCode.Enter, { code: KeyboardCode.Enter }), {
            active,
            currentCoordinates: initialCoordinates,
            context,
        });
        expect(result).toBeUndefined();
    });
});
