/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CommandResponse } from '../types';

export type AssetChooser = {
    dispatch(command: 'AssetChooser'): CommandResponse['AssetChooser'];
};
