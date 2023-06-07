/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Command, CommandResponse } from '../types';

export interface AssetViewer {
    dispatch(command: Command): CommandResponse[Command.AssetViewer];
}
