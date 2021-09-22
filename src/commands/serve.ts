import Fastify, { FastifyInstance } from "fastify";
import FastifyCors from "fastify-cors";
import FastifyStatic from "fastify-static";
import FastifyWebSocket from "fastify-websocket";
import Logger from "../utils/logger";
import { join } from "path";
import { compile } from "../utils/compile";
import { watch } from "../utils/watch";
import { FSWatcher } from "chokidar";

export interface SocketMessage {
    message: SocketMessageType;
    data: unknown;
}

export enum SocketMessageType {
    BlockUpdated = "block-updated",
}

export type Setting = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
};

class DevelopmentServer {
    private readonly rootPath: string;
    private readonly entryFilePath: string;
    private readonly settingsStructureFilePath: string;
    private readonly distPath: string;
    private readonly port: number;
    private readonly fastifyServer: FastifyInstance;

    constructor(
        entryFilePath = "src/index.tsx",
        settingsStructureFilePath = "src/settings.ts",
        customBlockPath = join(process.cwd(), "custom_block"),
        port = 5600,
    ) {
        this.rootPath = customBlockPath;
        this.entryFilePath = entryFilePath;
        this.settingsStructureFilePath = settingsStructureFilePath;
        this.distPath = join(this.rootPath, "dist");
        this.port = port;
        this.fastifyServer = Fastify();
    }

    watchForFileChangesAndCompile(): FSWatcher {
        const filesToIgnore = ["node_modules", "package*.json", ".git", ".gitignore", "dist", "src/settings.json"];

        return watch(
            this.rootPath,
            async () => {
                Logger.info(`Compiling...`);
                try {
                    await compile(
                        this.rootPath,
                        [this.entryFilePath, this.settingsStructureFilePath],
                        "DevCustomBlock",
                        {
                            distPath: this.distPath,
                            env: {
                                NODE_ENV: "development",
                            },
                        },
                    );
                    Logger.info("Compiled successfully!");
                } catch (error) {
                    Logger.error(error as string);
                }
            },
            filesToIgnore,
        );
    }

    serve(): void {
        this.registerPlugins();
        this.registerRoutes();
        this.registerWebsockets();

        this.fastifyServer.listen(this.port, "0.0.0.0");
    }

    registerRoutes(): void {
        this.fastifyServer.get("/", (_req, res) => {
            res.send({ status: "OK" });
        });
    }

    registerWebsockets(): void {
        this.fastifyServer.get("/websocket", { websocket: true }, (connection) => {
            // Send blocks and settings on first connection
            connection.socket.send(
                JSON.stringify({
                    message: SocketMessageType.BlockUpdated,
                }),
            );

            const blocksUpdateWatcher = watch(`${this.distPath}/**.js`, (event: string) => {
                if (event === "change") {
                    Logger.info("Notifying browser of updated block");
                    connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));
                }
            });

            connection.socket.on("close", () => {
                connection.socket.close();
                blocksUpdateWatcher.close();
            });
        });
    }

    registerPlugins(): void {
        this.fastifyServer.register(FastifyCors);
        this.fastifyServer.register(FastifyWebSocket);
        this.fastifyServer.register(FastifyStatic, {
            root: this.distPath,
        });
    }
}

export const createDevelopmentServer = (
    entryFilePath: string,
    settingsStructureFilePath: string,
    customBlockPath: string,
    port: number,
): void => {
    Logger.info("Starting the development server...");

    const developmentServer = new DevelopmentServer(entryFilePath, settingsStructureFilePath, customBlockPath, port);
    developmentServer.watchForFileChangesAndCompile();
    developmentServer.serve();

    Logger.info(`Development server is listening on port ${port}!`);
};
