#!/usr/bin/env node

import minimist from "minimist";
import { exit } from "process";
import { createNewProject } from "./commands/create";
import { createDevelopmentServer } from "./commands/serve";
import Logger from "./utils/logger";
import { printLogo } from "./utils/logo";

const parseArgs = minimist(process.argv.slice(2));

printLogo();

switch (parseArgs._[0]) {
    case "serve":
        Logger.info("Starting the development server...");

        const entryFileName = parseArgs.entry || "src/index.tsx";
        const customBlockPath = parseArgs.dir || process.cwd();
        const port = parseArgs.port || 5600;

        createDevelopmentServer(entryFileName, customBlockPath, port);

        Logger.info(`Development server listen on port ${port}!`);
        break;
    case "create":
        Logger.info("Creating a new project...");

        const projectName = parseArgs._[1] || "";

        createNewProject(projectName);

        break;
    case "deploy":
    default:
        Logger.error("This command is not yet handled");
        exit(0);
}
