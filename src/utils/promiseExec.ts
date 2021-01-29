import { exec, ExecOptions } from "child_process";

export const promiseExec = (command: string, options: ExecOptions = {}): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(stdout);
            }
        });
    });
};
