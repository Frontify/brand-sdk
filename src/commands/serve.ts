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

const port = Number(process.env.WS_SERVER_PORT) || 5600;
const customBlockPath = process.env.WATCH_PATH || path.join(__dirname, "blocks");
const customBlockDistPath = path.join(customBlockPath, "dist");
const customBlockEntryFile = process.env.ENTRY_FILE || "index.tsx";
const customBlockEntryFilePath = path.join(customBlockPath, customBlockEntryFile);

// Watch block update and compile
watch(
    customBlockPath,
    () => {
        compile(customBlockEntryFilePath, customBlockDistPath);
    },
    ["node_modules", ".git", "dist", `${customBlockPath}/**/settings.json`],
);

const fastify: FastifyInstance = Fastify();

fastify.register(FastifyCors);

fastify.register(FastifyWebSocket);

fastify.register(FastifyStatic, {
    root: customBlockDistPath,
});

fastify.ready((err) => {
    if (err) throw err;
    Logger.info(`🚀  Server started on port ${port}!`);
});

fastify.get("/", (_req, res) => {
    res.send({ status: "OK" });
});

fastify.get("/{blockId}", (_req, res) => {
    res.send({ settings: "OK" });
});

fastify.get("/websocket", { websocket: true }, (connection) => {
    connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated }));

    const blocksUpdateWatcher = watch(`${customBlockDistPath}/**.js`, (event: string, path: string) => {
        if (event === "change") {
            Logger.info("Notify browser of updated block", path);
            connection.socket.send(JSON.stringify({ message: SocketMessageType.BlockUpdated, data: "blockname" }));
        }
    });

    const settingsUpdateWatcher = watch(
        `${customBlockPath}/**/settings.json`,
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

fastify.listen(port);
