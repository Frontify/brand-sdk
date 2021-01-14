import { exec, ExecOptions } from "child_process";

export const promiseExec = (command: string, options: ExecOptions = {}): Promise<void> => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });
};
