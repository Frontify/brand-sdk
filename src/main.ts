#!/usr/bin/env node

import dotenv from "dotenv";
import minimist from "minimist";
import { exit } from "process";
import { DevelopmentServer } from "./commands/serve";
import Logger from "./utils/logger";
import { printLogo } from "./utils/logo";

dotenv.config();

const parseArgs = minimist(process.argv.slice(2));

switch (parseArgs._[0]) {
    case "serve":
        printLogo();
        Logger.info("Starting the development server...");

        const entryFileName = parseArgs.entry || "src/index.tsx";
        const customBlockPath = parseArgs.dir || process.cwd();
        const port = parseArgs.port || 5600;

        const developmentServer = new DevelopmentServer(entryFileName, customBlockPath, port);
        developmentServer.watchForFileChangesAndCompile();
        developmentServer.serve();

        Logger.info(`Development server listen on port ${port}!`);
        break;
    case "deploy":
    default:
        Logger.error("This command is not yet handled");
        exit(0);
}
