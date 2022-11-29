/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Bundle } from '../bundle';

export type ValueOrPromisedValue<AppBridge, FieldType> =
    | FieldType
    | ((bundle: Bundle<AppBridge>) => FieldType)
    | ((bundle: Bundle<AppBridge>) => Promise<FieldType>);

export type BaseBlock<AppBridge, T = undefined> = {
    id: string;
    label?: ValueOrPromisedValue<AppBridge, string>;
    info?: ValueOrPromisedValue<AppBridge, string>;
    value?: T;
    defaultValue?: T;
    showForTranslations?: boolean;
    show?: (bundle: Bundle<AppBridge>) => boolean;
    onChange?: (bundle: Bundle<AppBridge>) => void;
};
