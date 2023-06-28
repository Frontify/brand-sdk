/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AssetChooserOnMethod } from '../types';

export type useAssetChooser = (appBridge: AppBridgeBlock) => AssetChooserOnMethod;
