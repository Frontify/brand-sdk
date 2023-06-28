/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserOnMethod } from '../types';
import type { AssetChooserEvent } from '../types';

export interface AssetChooser {
    on<K extends keyof AssetChooserOnMethod>(eventName: K): ReturnType<AssetChooserOnMethod[K]>;

    off(eventName: AssetChooserEvent): void;

    dispatch(command: AssetChooserEvent): void;
}
