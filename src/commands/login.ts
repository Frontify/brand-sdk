import Logger from "../utils/logger";
import Fastify, { FastifyInstance } from "fastify";
import FastifyCors from "fastify-cors";
import {
    getLoginUrl,
    getOauthCredentialDetails,
    getRandomCodeChallenge,
    getUser,
    OauthRandomCodeChallenge,
} from "../utils/oauth";
import open from "open";
import { Configuration } from "../utils/store";
import { exit } from "process";
import { bold } from "chalk";

interface Query {
    code: string;
}

class AuthenticatorServer {
    private readonly fastifyServer: FastifyInstance;

    private readonly randomChallenge: OauthRandomCodeChallenge;
    private readonly port: number;

    constructor(randomChallenge: OauthRandomCodeChallenge, port = 5601) {
        this.randomChallenge = randomChallenge;
        this.port = port;

        this.fastifyServer = Fastify();
    }

    serve(): void {
        this.registerPlugins();
        this.registerRoutes();

        this.fastifyServer.listen(this.port);
    }

    registerRoutes(): void {
        this.fastifyServer.get<{ Querystring: Query }>("/oauth", async (req, res) => {
            Logger.info("Access granted, getting access token...");
            res.send("You can close this window.");

            const tokens = await getOauthCredentialDetails(this.randomChallenge.secret, req.query.code);
            Logger.info("Tokens received, storing tokens...");
            Configuration.set("tokens", tokens);

            const user = await getUser().catch(() => {
                Logger.error("An error occured while fetching user data.");
            });

            if (user) {
                Logger.info(`${bold(`Welcome back ${user.name}!`)}`);
            }

            exit(0);
        });
    }

    registerPlugins(): void {
        this.fastifyServer.register(FastifyCors);
    }
}

export const logUser = async (port: number): Promise<void> => {
    const randomChallengeResponse = await getRandomCodeChallenge();
    const randomChallenge = randomChallengeResponse.data;

    const developmentServer = new AuthenticatorServer(randomChallenge, port);
    developmentServer.serve();

    const loginUrl = getLoginUrl(randomChallenge);

    Logger.info("Opening OAuth login page...");
    await open(loginUrl);
};
