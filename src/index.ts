import minimist from "minimist";
import buildOptions from "minimist-options";
import { join } from "path";
import { exit } from "process";
import { createNewProject } from "./commands/create";
import { createDeployment } from "./commands/deploy";
import { loginUser } from "./commands/login";
import { logoutUser } from "./commands/logout";
import { createDevelopmentServer } from "./commands/serve";
import { Bundler } from "./utils/compile";
import Logger from "./utils/logger";
import { printLogo } from "./utils/logo";
import { getValidInstanceUrl } from "./utils/url";

const experimentalOptionName = "experimental";
const options = buildOptions({
    [experimentalOptionName]: {
        type: "boolean",
        alias: "e",
        default: false,
    },
});
const parseArgs = minimist(process.argv.slice(2), options);

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
            const bundler = parseArgs[experimentalOptionName] ? Bundler.Webpack : Bundler.Rollup;

            switch (parseArgs._[1]) {
                case "serve":
                    const minify =
                        typeof parseArgs.minify === "string" ? (parseArgs.minify === "true" ? true : false) : true;
                    createDevelopmentServer(entryFilePath, settingsStructureFilePath, customBlockPath, port, {
                        minify,
                        bundler,
                    });
                    break;

                case "deploy":
                    const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);
                    await createDeployment(
                        instanceUrl,
                        "block",
                        rootDir,
                        customBlockPath,
                        [entryFilePath, customBlockPath],
                        distPath,
                        {
                            dryRun: parseArgs["dry-run"],
                            openInBrowser: parseArgs.open,
                            bundler,
                        },
                    );
                    break;
            }
            break;

        case "create":
            const projectName = parseArgs._[1] || "";
            createNewProject(projectName);
            break;

        case "login":
            const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);
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
