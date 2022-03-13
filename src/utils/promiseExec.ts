import { ExecOptions, exec } from 'child_process';
import CommandExecutionError from '../errors/CommandExecutionError';

export const promiseExec = (command: string, options: ExecOptions = {}): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout) => {
            if (error) {
                return reject(new CommandExecutionError(error + stdout));
            } else {
                return resolve(stdout);
            }
        });
    });
};
