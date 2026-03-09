/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Color } from '../types';

export type UseColorsReturnType = {
    colorsByPaletteId: Color[];
};

export const useColors = (appBridge: AppBridgeBlock, colorPaletteId: number): UseColorsReturnType => {
    const blockId = appBridge.context('blockId').get();

    const [colorsByPaletteId, setColorsByPaletteId] = useState<Color[]>([]);

    useEffect(() => {
        let componentMounted = true;

        if (blockId) {
            const mountingFetch = async () => {
                const allColors = await appBridge.getColorsByColorPaletteId(colorPaletteId);
                if (componentMounted) {
                    const sortedColors = [...allColors].sort((a, b) => a.sort - b.sort);
                    setColorsByPaletteId(sortedColors);
                }
            };
            mountingFetch();
        }

        return () => {
            componentMounted = false;
        };
    }, [appBridge, blockId, colorPaletteId]);

    return { colorsByPaletteId };
};
