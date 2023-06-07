/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Command, CommandResponse } from '../types';

export interface AssetChooser {
    dispatch(command: Command.AssetChooser): CommandResponse[Command.AssetChooser];
}
