/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Color, type ColorCreate, type ColorPatch } from '../types';
import { compareObjects } from '../utilities';

export type UseColorsReturnType = {
    colorsByPaletteId: Color[];
    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * It has no effect anymore: Frontify retired project colors, manage colors in Brand Essentials instead.
     */
    createColor: (colorCreate: ColorCreate) => void;
    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * It has no effect anymore: Frontify retired project colors, manage colors in Brand Essentials instead.
     */
    updateColor: (colorId: number, colorPatch: ColorPatch) => void;
    /**
     * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
     * It has no effect anymore: Frontify retired project colors, manage colors in Brand Essentials instead.
     */
    deleteColor: (colorId: number) => void;
};

const getColorsOfPalette = async (appBridge: AppBridgeBlock, colorPaletteId: number): Promise<Color[]> => {
    const colorPalettes = await appBridge.getColorPalettesWithColors([colorPaletteId]);
    const colorPalette = colorPalettes.find((palette) => palette.id === colorPaletteId);

    return colorPalette?.colors ?? [];
};

/**
 * @deprecated will be removed in version 4.0.0 of `@frontify/app-bridge`
 * Use `useColorPalettes` instead. The colors come from `getColorPalettesWithColors`, and `createColor`,
 * `updateColor` and `deleteColor` have no effect anymore: Frontify retired project colors.
 */
export const useColors = (appBridge: AppBridgeBlock, colorPaletteId: number): UseColorsReturnType => {
    const blockId = appBridge.context('blockId').get();

    const [colorsByPaletteId, setColorsByPaletteId] = useState<Color[]>([]);

    useEffect(() => {
        let componentMounted = true;

        const updateColorsFromEvent = (event: { blockId: number; colors: Color[]; prevColors: Color[] }) => {
            if (event.blockId === blockId && !compareObjects(event.colors, event.prevColors)) {
                const sortedColors = [...event.colors].sort((a, b) => a.sort - b.sort);
                setColorsByPaletteId(sortedColors);
            }
        };

        if (blockId) {
            const mountingFetch = async () => {
                const allColors = await getColorsOfPalette(appBridge, colorPaletteId);
                if (componentMounted) {
                    const sortedColors = [...allColors].sort((a, b) => a.sort - b.sort);
                    setColorsByPaletteId(sortedColors);
                }
            };
            mountingFetch();

            window.emitter.on('AppBridge:ColorsUpdated', updateColorsFromEvent);
        }

        return () => {
            componentMounted = false;
            window.emitter.off('AppBridge:ColorsUpdated', updateColorsFromEvent);
        };
    }, [appBridge, blockId, colorPaletteId]);

    const emitUpdatedColors = async () => {
        window.emitter.emit('AppBridge:ColorsUpdated', {
            blockId,
            colors: await getColorsOfPalette(appBridge, colorPaletteId),
            prevColors: { ...colorsByPaletteId },
        });
    };

    const createColor = async (colorCreate: ColorCreate) => {
        await appBridge.createColor(colorCreate);

        emitUpdatedColors();
    };

    const updateColor = async (colorId: number, colorPatch: ColorPatch) => {
        await appBridge.updateColor(colorId, colorPatch);

        emitUpdatedColors();
    };

    const deleteColor = async (colorId: number) => {
        await appBridge.deleteColor(colorId);

        emitUpdatedColors();
    };

    return {
        colorsByPaletteId,
        createColor,
        updateColor,
        deleteColor,
    };
};
