/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Checkbox = {
    /**
     * The unique identifier of the checkbox.
     *
     * This is the value you will receive when clicking the checkbox.
     */
    id: string;

    /**
     * The label for the checkbox.
     */
    label?: string;

    /**
     * Additional information about the settings to be shown in a tooltip.
     */
    info?: string;

    /**
     * The tooltip for the checkbox.
     * @deprecated
     */
    tooltip?: {
        /**
         * The content of the tooltip.
         */
        content: string;
    };
};
