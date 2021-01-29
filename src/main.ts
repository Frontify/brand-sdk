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

const parseArgs = minimist(process.argv.slice(2));

printLogo();

(async () => {
    const customBlockPath = parseArgs.dir || process.cwd();
    const customBlockPackageJson = await import(path.join(customBlockPath, "package.json"));
    const entryFileName = parseArgs.entry || customBlockPackageJson.main || "src/index.tsx";
    const port = parseArgs.port || 5600;
    const projectName = parseArgs._[1] || "";
    const instanceUrl = parseArgs._[1] || process.env.INSTANCE_URL || "";

    switch (parseArgs._[0]) {
        case "serve":
            createDevelopmentServer(entryFileName, customBlockPath, port);
            break;
        case "create":
            createNewProject(projectName);
            break;
        case "deploy":
            createDeployment(instanceUrl, customBlockPath);
            break;
        case "login":
            await loginUser(instanceUrl, port);
            break;
        case "logout":
            logoutUser();
            break;
        default:
            Logger.error("This command is not yet handled");
            exit(1);
    }
})();
