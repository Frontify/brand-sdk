/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type ColorPalette } from '../types';

export type UseColorPalettesReturnType = {
    colorPalettes: ColorPalette[];
    downloadColorKit: (selectedColorPalettes: number[]) => string;
};

export const useColorPalettes = (appBridge: AppBridgeBlock, colorPaletteIds?: number[]): UseColorPalettesReturnType => {
    const blockId = appBridge.context('blockId').get();

    const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);

    useEffect(() => {
        let componentMounted = true;

        if (blockId) {
            const mountingFetch = async () => {
                const allColorPalettes = await appBridge.getColorPalettesWithColors(colorPaletteIds);
                if (componentMounted) {
                    setColorPalettes(allColorPalettes);
                }
            };
            mountingFetch();
        }

        return () => {
            componentMounted = false;
        };
    }, [appBridge, blockId, colorPaletteIds]);

    const downloadColorKit = (selectedColorPalettes: number[]) => {
        return appBridge.downloadColorKit(selectedColorPalettes);
    };

    return {
        colorPalettes,
        downloadColorKit,
    };
};
