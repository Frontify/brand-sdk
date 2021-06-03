#!/usr/bin/env node

import minimist from "minimist";
import Logger from "./utils/logger";
import { exit } from "process";
import { createDeployment } from "./commands/deploy";
import { createDevelopmentServer } from "./commands/serve";
import { printLogo } from "./utils/logo";
import { loginUser } from "./commands/login";
import { logoutUser } from "./commands/logout";
import { getValidInstanceUrl } from "./utils/url";
import { join } from "path";
import { reactiveJson } from "./utils/reactiveJson";

const parseArgs = minimist(process.argv.slice(2));

printLogo();

(async () => {
    const port = parseArgs.port || 5600;

    const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);

    const rootPath = parseArgs.dir || process.cwd();

    switch (parseArgs._[0]) {
        case "block":
            const customBlockPath = join(rootPath, "custom_block");
            const customBlockPackageJson = reactiveJson<PackageJson>(join(customBlockPath, "package.json"));

            const entryFileName = parseArgs.entry || customBlockPackageJson.main || "src/index.tsx";

            const distPath = parseArgs.dist || "dist";

            switch (parseArgs._[1]) {
                case "serve":
                    createDevelopmentServer(entryFileName, customBlockPath, port);
                    break;

                case "deploy":
                    createDeployment(instanceUrl, "block", rootPath, customBlockPath, entryFileName, distPath, {
                        dryRun: parseArgs["dry-run"],
                        openInBrowser: parseArgs.open,
                    });
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
