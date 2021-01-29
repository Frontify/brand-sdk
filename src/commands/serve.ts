import Fastify, { FastifyInstance } from "fastify";
import FastifyCors from "fastify-cors";
import FastifyStatic from "fastify-static";
import FastifyWebSocket from "fastify-websocket";
import Logger from "../utils/logger";
import { join } from "path";
import { readFileSync } from "fs";
import { compile } from "../utils/compile";
import { watch } from "../utils/watch";
import { FSWatcher } from "chokidar";

export interface SocketMessage {
    message: SocketMessageType;
    data: unknown;
}

export enum SocketMessageType {
    BlockUpdated = "block-updated",
    SettingsStructureUpdated = "settings-structure-updated",
}

export type Setting = {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    value?: string;
};

class DevelopmentServer {
    private readonly customBlockPath: string;
    private readonly customBlockEntryFile: string;
    private readonly customBlockDistPath: string;

    private readonly port: number;

    private readonly fastifyServer: FastifyInstance;

    constructor(entryFileName = "src/index.tsx", customBlockPath = process.cwd(), port = 5600) {
        this.customBlockPath = customBlockPath;
        this.customBlockEntryFile = entryFileName;
        this.customBlockDistPath = join(this.customBlockPath, "dist");

        this.port = port;

        this.fastifyServer = Fastify();
    }

    watchForFileChangesAndCompile(): FSWatcher {
        const filesToIgnore = ["node_modules", "package*.json", ".git", ".gitignore", "dist", "src/settings.json"];

        return watch(
            this.customBlockPath,
            () => {
                compile(this.customBlockEntryFile, this.customBlockPath, this.customBlockDistPath);
            },
            filesToIgnore,
        );
    }

    serve(): void {
        this.registerPlugins();
        this.registerRoutes();
        this.registerWebsockets();

        this.fastifyServer.listen(this.port);
    }

    registerRoutes(): void {
        this.fastifyServer.get("/", (_req, res) => {
            res.send({ status: "OK" });
        });
    }

    registerWebsockets(): void {
        this.fastifyServer.get("/websocket", { websocket: true }, (connection) => {
            // Send blocks and settings on first connection
            connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));
            connection.socket.send(
                JSON.stringify({
                    message: SocketMessageType.SettingsStructureUpdated,
                    data: this.getSettings(),
                }),
            );

            const blocksUpdateWatcher = watch(`${this.customBlockDistPath}/**.js`, (event: string) => {
                if (event === "change") {
                    Logger.info("Notify browser of updated block");
                    connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));
                }
            });

            const settingsUpdateWatcher = watch(
                join(this.customBlockPath, "/src/settings.json"),
                async (event: string, eventPath: string) => {
                    if (event === "change") {
                        try {
                            const settingsJson = this.getSettings();

                            Logger.info("Notifying browser of updated settings");

                            connection.socket.send(
                                JSON.stringify({
                                    message: SocketMessageType.SettingsStructureUpdated,
                                    data: settingsJson,
                                }),
                            );
                        } catch (error) {
                            if (error instanceof SyntaxError) {
                                Logger.error(`An error occured while parsing \`settings.json\` in ${eventPath}`);
                            } else {
                                Logger.error("An unknown error occured:", error);
                            }
                        }
                    }
                },
            );

            connection.socket.on("message", (socketMessage: string) => {
                const parsedEvent: SocketMessage = JSON.parse(socketMessage);
                const message = parsedEvent.message;
                const data = parsedEvent.data;

                Logger.info(`Message received: ${message}${data && ` with data: ${data}`}`);

                switch (message) {
                    default: {
                        Logger.error("Bad message received");
                        break;
                    }
                }
            });

            connection.socket.on("close", () => {
                connection.socket.close();
                blocksUpdateWatcher.close();
                settingsUpdateWatcher.close();
            });
        });
    }

    registerPlugins(): void {
        this.fastifyServer.register(FastifyCors);

        this.fastifyServer.register(FastifyWebSocket);

        this.fastifyServer.register(FastifyStatic, {
            root: this.customBlockDistPath,
        });
    }

    getSettings(): Setting[] {
        const settingsRaw = readFileSync(join(this.customBlockPath, "src/settings.json"), "utf8");
        return JSON.parse(settingsRaw);
    }
}

export const createDevelopmentServer = (entryFileName: string, customBlockPath: string, port: number): void => {
    Logger.info("Starting the development server...");

    const developmentServer = new DevelopmentServer(entryFileName, customBlockPath, port);
    developmentServer.watchForFileChangesAndCompile();
    developmentServer.serve();

    Logger.info(`Development server is listening on port ${port}!`);
};
