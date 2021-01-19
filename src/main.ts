#!/usr/bin/env node

import minimist from "minimist";
import path from "path";
import Logger from "./utils/logger";
import { exit } from "process";
import { createNewProject } from "./commands/create";
import { createDeployment } from "./commands/deploy";
import { createDevelopmentServer } from "./commands/serve";
import { printLogo } from "./utils/logo";

const parseArgs = minimist(process.argv.slice(2));

printLogo();

(async () => {
    const customBlockPath = parseArgs.dir || process.cwd();
    const customBlockPackageJson = await import(path.join(customBlockPath, "package.json"));
    const customBlockName = parseArgs.blockName || customBlockPackageJson.name || "default";
    const entryFileName = parseArgs.entry || customBlockPackageJson.main || "src/index.tsx";
    const port = parseArgs.port || 5600;
    const projectName = parseArgs._[1] || "";

    switch (parseArgs._[0]) {
        case "serve":
            createDevelopmentServer(customBlockName, entryFileName, customBlockPath, port);
            break;
        case "create":
            createNewProject(projectName);
            break;
        case "deploy":
            createDeployment(customBlockName, customBlockPath);
            break;
        default:
            Logger.error("This command is not yet handled");
            exit(0);
    }
})();
