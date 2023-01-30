/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Bundle } from '../bundle';

export type ValueOrPromisedValue<AppBridge, FieldType> =
    | FieldType
    | ((bundle: Bundle<AppBridge>) => FieldType)
    | ((bundle: Bundle<AppBridge>) => Promise<FieldType>);

export type BaseBlock<AppBridge, T = undefined> = {
    /**
     * The unique identifier of the settings.
     *
     * This identifier will be the one used as a key in the different settings hooks.
     */
    id: string;

    /**
     * The label of the setting.
     */
    label?: ValueOrPromisedValue<AppBridge, string>;

    /**
     * Additionnal information about the settings to be shown in a tooltip.
     */
    info?: ValueOrPromisedValue<AppBridge, string>;

    /**
     * The current value of the setting.
     */
    value?: T;

    /**
     * The default value of the setting.
     */
    defaultValue?: T;

    /**
     * Whether the setting should be shown when translating the page or not.
     */
    showForTranslations?: boolean;

    /**
     * A function that determines whether the setting should be shown or not.
     */
    show?: (bundle: Bundle<AppBridge>) => boolean;

    /**
     * A function that is called when the setting value change.
     */
    onChange?: (bundle: Bundle<AppBridge>) => void;
};
