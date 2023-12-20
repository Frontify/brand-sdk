/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type ColorPalette, type ColorPaletteCreate, type ColorPalettePatch } from '../types';
import { compareObjects } from '../utilities';

export type UseColorPalettesReturnType = {
    colorPalettes: ColorPalette[];
    createColorPalette: (colorPaletteCreate: ColorPaletteCreate) => Promise<void>;
    updateColorPalette: (colorPaletteId: number, colorPalettePatch: ColorPalettePatch) => Promise<void>;
    deleteColorPalette: (colorPaletteId: number) => Promise<void>;
    downloadColorKit: (selectedColorPalettes: number[]) => string;
};

export const useColorPalettes = (appBridge: AppBridgeBlock, colorPaletteIds?: number[]): UseColorPalettesReturnType => {
    const blockId = appBridge.getBlockId();

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

    const emitUpdatedColorPalettes = async () => {
        window.emitter.emit('AppBridge:ColorPalettesUpdated', {
            blockId,
            colorPalettes: await appBridge.getColorPalettesWithColors(colorPaletteIds),
            prevColorPalettes: { ...colorPalettes },
        });
    };

    const createColorPalette = async (colorPaletteCreate: ColorPaletteCreate) => {
        await appBridge.createColorPalette(colorPaletteCreate);

        emitUpdatedColorPalettes();
    };

    const updateColorPalette = async (colorPaletteId: number, colorPalettePatch: ColorPalettePatch) => {
        await appBridge.updateColorPalette(colorPaletteId, colorPalettePatch);

        emitUpdatedColorPalettes();
    };

    const deleteColorPalette = async (colorPaletteId: number) => {
        await appBridge.deleteColorPalette(colorPaletteId);

        emitUpdatedColorPalettes();
    };

    const downloadColorKit = (selectedColorPalettes: number[]) => {
        return appBridge.downloadColorKit(selectedColorPalettes);
    };

    return {
        colorPalettes,
        createColorPalette,
        updateColorPalette,
        deleteColorPalette,
        downloadColorKit,
    };
};
