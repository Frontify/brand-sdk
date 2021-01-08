import { exec } from "child_process";
import Logger from "./logger";

export const compile = (entryFilePath: string, distPath: string): void => {
    //deleted shim file: export * as React from "react";
    //with inject: const command = `esbuild ${entryFilePath} --bundle --sourcemap --inject:./react-shim.js --define:process.env.NODE_ENV=\\\"development\\\" --target=chrome58,firefox57,safari11,edge16 --format=iife --global-name=DevCustomBlock --outfile=${distPath}/index.js`;
    const command = `esbuild ${entryFilePath} --bundle --sourcemap --minify --define:process.env.NODE_ENV=\\\"development\\\" --target=chrome58,firefox57,safari11,edge16 --format=iife --global-name=DevCustomBlock --outfile=${distPath}/index.js`;

    exec(command, (error, _stdout, stderr) => {
        if (error) {
            Logger.error("Error:", error.message);
            return;
        }
        if (stderr) {
            Logger.error("Error:", stderr);
            return;
        }
        Logger.info("Custom block compiled");
    });
};
