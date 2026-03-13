/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type ColorPalette } from '../types';
import { compareObjects } from '../utilities';

export type UseColorPalettesReturnType = {
    colorPalettes: ColorPalette[];
    downloadColorKit: (selectedColorPalettes: number[]) => string;
};

export const useColorPalettes = (appBridge: AppBridgeBlock, colorPaletteIds?: number[]): UseColorPalettesReturnType => {
    const blockId = appBridge.context('blockId').get();

    const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);

    const updateColorsPalettesFromEvent = (event: {
        blockId: number;
        colorPalettes: ColorPalette[];
        prevColorPalettes: ColorPalette[];
    }) => {
        if (event.blockId === blockId && !compareObjects(event.colorPalettes, event.prevColorPalettes)) {
            setColorPalettes(event.colorPalettes);
        }
    };

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

            window.emitter.on('AppBridge:ColorPalettesUpdated', updateColorsPalettesFromEvent);
        }

        return () => {
            componentMounted = false;
            window.emitter.off('AppBridge:ColorPalettesUpdated', updateColorsPalettesFromEvent);
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
