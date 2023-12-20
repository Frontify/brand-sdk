/* (c) Copyright Frontify Ltd., all rights reserved. */

import { KeyboardCode, type KeyboardCoordinateGetter } from '@dnd-kit/core';

const directions: string[] = [KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];

export const customCoordinatesGetterFactory =
    (columnGap: number, rowGap: number): KeyboardCoordinateGetter =>
    (event, { currentCoordinates, context: { activeNode } }) => {
        event.preventDefault();
        if (directions.includes(event.code)) {
            const width = activeNode?.offsetWidth ?? 0;
            const height = activeNode?.offsetHeight ?? 0;

            switch (event.code) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                case KeyboardCode.Right:
                    return {
                        ...currentCoordinates,
                        x: currentCoordinates.x + width + columnGap,
                    };
                // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                case KeyboardCode.Left:
                    return {
                        ...currentCoordinates,
                        x: currentCoordinates.x - width - columnGap,
                    };
                // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                case KeyboardCode.Down:
                    return {
                        ...currentCoordinates,
                        y: currentCoordinates.y + height + rowGap,
                    };
                // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                case KeyboardCode.Up:
                    return {
                        ...currentCoordinates,
                        y: currentCoordinates.y - height - rowGap,
                    };
            }
        }
        return undefined;
    };
