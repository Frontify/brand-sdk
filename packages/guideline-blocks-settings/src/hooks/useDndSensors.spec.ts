/* (c) Copyright Frontify Ltd., all rights reserved. */

import { renderHook } from '@testing-library/react';
import { useDndSensors } from './useDndSensors';
import { describe, expect, it } from 'vitest';
import { KeyboardSensorOptions } from '@dnd-kit/core';

/**
 * @vitest-environment happy-dom
 */
describe('useDndSensors', () => {
    it('should create a PointerSensor and a KeyboardSensor with a coordinate getter function and custom keyboardCodes', () => {
        const { result } = renderHook(() => useDndSensors());
        expect(result.current.length).toBe(2);
        expect(result.current[0].sensor.name).toBe('PointerSensor');
        expect(result.current[1].sensor.name).toBe('KeyboardSensor');
        expect(typeof (result.current[1].options as KeyboardSensorOptions).coordinateGetter).toBe('function');
        expect((result.current[1].options as KeyboardSensorOptions).keyboardCodes).toEqual({
            start: ['Space', 'Enter'],
            cancel: [],
            end: ['Space', 'Enter', 'Escape'],
        });
    });

    it('should create a PointerSensor and a KeyboardSensor with a coordinate getter with columnGap', () => {
        const { result } = renderHook(() => useDndSensors(100));
        expect(result.current.length).toBe(2);
        expect(result.current[0].sensor.name).toBe('PointerSensor');
        expect(result.current[1].sensor.name).toBe('KeyboardSensor');
        expect(typeof (result.current[1].options as KeyboardSensorOptions).coordinateGetter).toBe('function');
    });

    it('should create a PointerSensor and a KeyboardSensor with a coordinate getter with columnGap and rowGap', () => {
        const { result } = renderHook(() => useDndSensors(100, 150));
        expect(result.current.length).toBe(2);
        expect(result.current[0].sensor.name).toBe('PointerSensor');
        expect(result.current[1].sensor.name).toBe('KeyboardSensor');
        expect(typeof (result.current[1].options as KeyboardSensorOptions).coordinateGetter).toBe('function');
    });
});
