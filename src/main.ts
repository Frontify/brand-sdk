#!/usr/bin/env node

import minimist from "minimist";
import path from "path";
import Logger from "./utils/logger";
import { exit } from "process";
import { createNewProject } from "./commands/create";
import { createDeployment } from "./commands/deploy";
import { createDevelopmentServer } from "./commands/serve";
import { printLogo } from "./utils/logo";
import { loginUser } from "./commands/login";
import { logoutUser } from "./commands/logout";
import { Configuration } from "./utils/configuration";

const parseArgs = minimist(process.argv.slice(2));

printLogo();

(async () => {
    const port = parseArgs.port || 5600;
    const instanceUrl = parseArgs.instance || process.env.INSTANCE_URL;

    switch (parseArgs._[0]) {
        case "block":
            const customBlockPath = parseArgs.dir || process.cwd();

            switch (parseArgs._[1]) {
                case "serve":
                    const customBlockPackageJson = await import(path.join(customBlockPath, "package.json"));
                    const entryFileName = parseArgs.entry || customBlockPackageJson.main || "src/index.tsx";
                    createDevelopmentServer(entryFileName, customBlockPath, port);
                    break;
                case "create":
                    const projectName = parseArgs._[2] || "";
                    createNewProject(projectName);
                    break;
                case "deploy":
                    createDeployment(instanceUrl, "block", "custom_block", "src/index.tsx", "dist");
                    break;
            }
            break;

        case "login":
            await loginUser(instanceUrl, port);
            break;

        case "logout":
            logoutUser();
            exit(1);

        default:
            Logger.error("This command is not yet handled");
            exit(1);
    }
})();
