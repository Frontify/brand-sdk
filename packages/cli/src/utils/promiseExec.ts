/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ExecOptions, exec } from 'node:child_process';

import CommandExecutionError from '../errors/CommandExecutionError';

export const promiseExec = (command: string, options: ExecOptions = {}): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout) => {
            if (error) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
                return reject(new CommandExecutionError(error + stdout));
            } else {
                return resolve(stdout);
            }
        });
    });
};
