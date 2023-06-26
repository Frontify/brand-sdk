/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CommandResponse } from '../types';

export interface AssetViewer {
    dispatch(command: 'AssetViewer'): CommandResponse['AssetViewer'];
    dispatch(command: 'assetChooser'): CommandResponse['AssetChooser'];
}
