import Fastify, { FastifyInstance } from "fastify";
import FastifyCors from "fastify-cors";
import FastifyStatic from "fastify-static";
import FastifyWebSocket from "fastify-websocket";
import Logger from "../utils/logger";
import path from "path";
import { readFileSync } from "fs";
import { compile } from "../utils/compile";
import { SocketMessage } from "../SocketMessage";
import { SocketMessageType } from "../SocketMessageType";
import { watch } from "../utils/watch";
import { FSWatcher } from "chokidar";

export class DevelopmentServer {
    private readonly customBlockPath: string;
    private readonly customBlockEntryFile: string;
    private readonly customBlockEntryFilePath: string;
    private readonly customBlockDistPath: string;

    private readonly port: number;

    private readonly fastifyServer: FastifyInstance;

    constructor(entryFileName = "src/index.tsx", customBlockPath = process.cwd(), port = 5600) {
        this.customBlockPath = customBlockPath;
        this.customBlockEntryFile = entryFileName;
        this.customBlockEntryFilePath = path.join(this.customBlockPath, this.customBlockEntryFile);
        this.customBlockDistPath = path.join(this.customBlockPath, "dist");

        this.port = port;

        this.fastifyServer = Fastify();
    }

    watchForFileChangesAndCompile(): FSWatcher {
        const filesToIgnore = [
            "node_modules",
            "package*.json",
            ".git",
            ".gitignore",
            "dist",
            `${this.customBlockPath}/**/settings.json`,
        ];

        return watch(
            this.customBlockPath,
            () => {
                compile(this.customBlockEntryFilePath, this.customBlockDistPath);
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

        this.fastifyServer.get("/{blockId}", (_req, res) => {
            res.send({ settings: "OK" });
        });
    }

    registerWebsockets(): void {
        this.fastifyServer.get("/websocket", { websocket: true }, (connection) => {
            connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));

            const blocksUpdateWatcher = watch(`${this.customBlockDistPath}/**.js`, (event: string, path: string) => {
                if (event === "change") {
                    Logger.info("Notify browser of updated block", path);
                    connection.socket.send(
                        JSON.stringify({ message: SocketMessageType.BlockUpdated, data: "blockname" }),
                    );
                }
            });

            const settingsUpdateWatcher = watch(
                `${this.customBlockPath}/**/settings.json`,
                async (event: string, eventPath: string) => {
                    if (event === "change") {
                        const settingsRaw = readFileSync(eventPath, "utf8");
                        const settingsJson = JSON.parse(settingsRaw);
                        const eventPathArray = eventPath.split("/");
                        const blockName = eventPathArray[eventPathArray.length - 2];

                        Logger.info("Notify browser of updated settings");

                        connection.socket.send(
                            JSON.stringify({
                                message: SocketMessageType.SettingsStructureUpdated,
                                data: { blockName, blockSettings: settingsJson },
                            }),
                        );
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
}
