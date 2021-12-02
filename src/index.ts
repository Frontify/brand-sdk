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
import { createNewProject } from "./commands/create";

const parseArgs = minimist(process.argv.slice(2));

printLogo();

(async () => {
    const port = parseArgs.port || 5600;

    const rootDir = parseArgs.dir || process.cwd();
    const blockDir = parseArgs.blockDir || join(process.cwd(), "custom_block");

    switch (parseArgs._[0]) {
        case "block":
            const customBlockPath = blockDir || join(rootDir, "custom_block");
            const entryFilePath = parseArgs.entry || "src/index.tsx";
            const settingsStructureFilePath = parseArgs.settingsStructure || "src/settings.ts";
            const distPath = parseArgs.dist || "dist";

            createDevelopmentServer(entryFilePath, settingsStructureFilePath, customBlockPath, port, {});
            break;
    }
})();
