/* (c) Copyright Frontify Ltd., all rights reserved. */

/**
 * RGBA color exchanged with the host color chooser. `alpha` ranges from 0 to 1.
 */
export type ColorChooserColor = {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
    name?: string;
};

export type ColorChooserOptions = {
    /**
     * Element the host renders the color chooser into. It also identifies the chooser for `closeColorChooser`.
     */
    element: HTMLElement;
    /**
     * Initially selected color.
     */
    color?: ColorChooserColor;
    /**
     * Called whenever a color is picked in the chooser.
     */
    onColorSelect: (color: ColorChooserColor) => void;
};

export type CloseColorChooserOptions = {
    /**
     * The element that was passed to `openColorChooser`.
     */
    element: HTMLElement;
};
