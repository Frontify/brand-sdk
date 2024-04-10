/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger } from '../utils/logger';

export default class CommandExecutionError extends Error {
    readonly name = 'CommandExecutionError';
    constructor(error: string) {
        super();
        Logger.error(`The command execution failed: ${error}`);
    }
}
