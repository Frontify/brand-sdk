/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { compareObjects } from '../utilities';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Color, ColorCreate, ColorPatch } from '../types';

export type UseColorsReturnType = {
    colorsByPaletteId: Color[];
    createColor: (colorCreate: ColorCreate) => void;
    updateColor: (colorId: number, colorPatch: ColorPatch) => void;
    deleteColor: (colorId: number) => void;
};

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
                const allColors = await appBridge.getColorsByColorPaletteId(colorPaletteId);
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
            colors: await appBridge.getColorsByColorPaletteId(colorPaletteId),
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
