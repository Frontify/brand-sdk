/* (c) Copyright Frontify Ltd., all rights reserved. */

import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMemo } from 'react';

import { customCoordinatesGetterFactory } from '../helpers/customCoordinatesGetterFactory';

const keyboardCodes = {
    start: ['Space', 'Enter'],
    cancel: [],
    end: ['Space', 'Enter', 'Escape'],
};

export const useDndSensors = (columnGap = 0, rowGap = 0) => {
    const keyboardSensorOptions = useMemo(() => {
        const customCoordinatesGetter = customCoordinatesGetterFactory(columnGap, rowGap);
        return {
            coordinateGetter: customCoordinatesGetter,
            keyboardCodes,
        };
    }, [columnGap, rowGap]);

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, keyboardSensorOptions));

    return sensors;
};
