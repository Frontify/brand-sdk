/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock, type ColorChooserColor, closeColorChooser, openColorChooser } from '@frontify/app-bridge';
import { type ReactElement, useEffect, useRef } from 'react';

export type ColorChooserProps = {
    appBridge: AppBridgeBlock;
    /**
     * Initially selected color. Changing it while the chooser is mounted has no effect.
     */
    color?: ColorChooserColor;
    /**
     * Called whenever a color is picked in the chooser.
     */
    onColorSelect: (color: ColorChooserColor) => void;
};

/**
 * Renders the host's color chooser (brand palettes and a custom color picker) in place.
 * It only renders the chooser itself, so place it inside your own flyout and handle saving and cancelling there.
 */
export const ColorChooser = ({ appBridge, color, onColorSelect }: ColorChooserProps): ReactElement => {
    const elementRef = useRef<HTMLDivElement>(null);
    const initialColorRef = useRef(color);
    const onColorSelectRef = useRef(onColorSelect);
    onColorSelectRef.current = onColorSelect;

    useEffect(() => {
        const element = elementRef.current;
        if (!element) {
            return;
        }

        appBridge
            .dispatch(
                openColorChooser({
                    element,
                    color: initialColorRef.current,
                    onColorSelect: (selectedColor) => onColorSelectRef.current(selectedColor),
                }),
            )
            .catch(console.error);

        return () => {
            appBridge.dispatch(closeColorChooser({ element })).catch(console.error);
        };
    }, [appBridge]);

    return <div ref={elementRef} data-test-id="color-chooser" />;
};
