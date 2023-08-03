/* (c) Copyright Frontify Ltd., all rights reserved. */

import { KeyboardCode, KeyboardCoordinateGetter } from '@dnd-kit/core';

const directions: string[] = [KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];

export const customCoordinatesGetterFactory =
    (columnGap: number, rowGap: number): KeyboardCoordinateGetter =>
    (event, { currentCoordinates, context: { activeNode } }) => {
        event.preventDefault();
        if (directions.includes(event.code)) {
            const width = activeNode?.offsetWidth ?? 0;
            const height = activeNode?.offsetHeight ?? 0;

            switch (event.code) {
                case KeyboardCode.Right:
                    return {
                        ...currentCoordinates,
                        x: currentCoordinates.x + width + columnGap,
                    };
                case KeyboardCode.Left:
                    return {
                        ...currentCoordinates,
                        x: currentCoordinates.x - width - columnGap,
                    };
                case KeyboardCode.Down:
                    return {
                        ...currentCoordinates,
                        y: currentCoordinates.y + height + rowGap,
                    };
                case KeyboardCode.Up:
                    return {
                        ...currentCoordinates,
                        y: currentCoordinates.y - height - rowGap,
                    };
            }
        }
        return undefined;
    };
