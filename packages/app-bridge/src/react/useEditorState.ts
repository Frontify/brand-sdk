/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useEditorState = (appBridge: AppBridgeBlock): boolean => {
    return useSyncExternalStore(appBridge.context('isEditing').subscribe, appBridge.context('isEditing').get);
};
