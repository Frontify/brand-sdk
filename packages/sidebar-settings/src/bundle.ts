/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SettingBlock } from './blocks';

export type SettingValue<AppBridge> = {
    value?: SettingBlock<AppBridge>['value'];
};

export type Bundle<AppBridge> = {
    getBlock: (id: string) => SettingValue<AppBridge> | null;
    getAppBridge: () => AppBridge;
    setBlockValue: (key: string, value: SettingBlock<AppBridge>['value']) => void;
};
