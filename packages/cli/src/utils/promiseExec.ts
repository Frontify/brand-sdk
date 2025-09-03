/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ExecOptions, exec } from 'node:child_process';

import CommandExecutionError from '../errors/CommandExecutionError';

export const promiseExec = (command: string, options: ExecOptions = {}): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout) => {
            if (error) {
                // @ts-expect-error node typing change
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                return reject(new CommandExecutionError(error + stdout));
            } else {
                // @ts-expect-error node typing change
                return resolve(stdout);
            }
        });
    });
};
