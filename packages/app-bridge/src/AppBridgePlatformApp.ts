/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridge } from './AppBridge';
import type { ApiMethodsRegistry } from './AppBridgeApiMethodsRegistry';

type ApiMethods = Pick<ApiMethodsRegistry, 'createAsset' | 'createAttachemnt' | 'currentUser'>;

export type AppBridgePlaformApp = AppBridge<ApiMethods>;
