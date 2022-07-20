/* (c) Copyright Frontify Ltd., all rights reserved. */

import Logger from '../utils/logger';
import Fastify, { FastifyInstance } from 'fastify';
import FastifyCors from 'fastify-cors';
import open from 'open';
import { Configuration } from '../utils/configuration';
import { exit } from 'process';
import { getValidInstanceUrl } from '../utils/url';
import { HttpClient } from '../utils/httpClient';
import { Headers } from 'node-fetch';
import { getUser } from '../utils/user';

interface Query {
    code: string;
}

export interface OauthRandomCodeChallenge {
    secret: string;
    sha256: string;
}

export interface OauthAccessTokenApiResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}

export class Authenticator {
    private readonly instanceUrl: string;
    private readonly port: number;

    private readonly httpClient: HttpClient;
    private readonly fastifyServer: FastifyInstance;

    private randomChallenge: OauthRandomCodeChallenge | undefined;

    constructor(instanceUrl: string, port = 5600) {
        this.instanceUrl = instanceUrl;
        this.port = port;

        this.httpClient = new HttpClient(instanceUrl);
        this.fastifyServer = Fastify();
    }

    serveCallbackServer(): void {
        this.registerPlugins();
        this.registerRoutes();

        this.fastifyServer.listen(this.port);
    }

    private registerRoutes(): void {
        this.fastifyServer.get<{ Querystring: Query }>('/oauth', async (req, res) => {
            Logger.info('Access granted, getting access token...');
            res.send('You can close this window.');

            const tokens = await this.getOauthCredentialDetails(req.query.code);
            Logger.info('Tokens received, storing tokens...');
            Configuration.set('tokens', tokens);

            const user = await getUser(this.instanceUrl);
            user && Logger.success(`${`Welcome back ${user.name} (${this.instanceUrl})!`}`);

            exit(0);
        });
    }

    private registerPlugins(): void {
        this.fastifyServer.register(FastifyCors);
    }

    async storeRandomCodeChallenge(): Promise<void> {
        try {
            const randomCodeChallenge = await this.httpClient.get<{ data: OauthRandomCodeChallenge }>(
                '/api/oauth/random'
            );
            this.randomChallenge = randomCodeChallenge.data;
        } catch {
            throw new Error('An error occured while getting the random challenge.');
        }
    }

    getLoginUrl(): string {
        if (!this.randomChallenge) {
            throw new Error('Random challenge needs to be defined');
        }

        const queryParams = [
            'response_type=code',
            'client_id=block-cli',
            'redirect_uri=http://localhost:5600/oauth',
            'scope=basic:read%2Bblocks:read%2Bblocks:write',
            `code_challenge=${this.randomChallenge.sha256}`,
            'code_challenge_method=S256',
        ].join('&');

        return `https://${this.instanceUrl}/api/oauth/authorize?${queryParams}`;
    }

    async getOauthCredentialDetails(authorizationCode: string): Promise<OauthAccessTokenApiResponse> {
        if (!this.randomChallenge) {
            throw new Error('Random challenge needs to be defined');
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        try {
            const tokens = await this.httpClient.post<OauthAccessTokenApiResponse>(
                '/api/oauth/accesstoken',
                {
                    grant_type: 'authorization_code',
                    client_id: 'block-cli',
                    redirect_uri: 'http://localhost:5600/oauth',
                    scope: 'basic:read%2Bblocks:read%2Bblocks:write',
                    code_verifier: this.randomChallenge.secret,
                    code: authorizationCode,
                },
                {
                    headers,
                }
            );

            return tokens;
        } catch (error) {
            throw new Error(`An error occured while getting tokens: ${(error as Error).message}`);
        }
    }
}

export const loginUser = async (instanceUrl: string, port: number): Promise<void> => {
    try {
        const cleanedInstanceUrl = getValidInstanceUrl(instanceUrl);
        const authenticator = new Authenticator(cleanedInstanceUrl, port);
        authenticator.serveCallbackServer();
        await authenticator.storeRandomCodeChallenge();

        const loginUrl = authenticator.getLoginUrl();

        Logger.info('Opening OAuth login page...');
        await open(loginUrl);
    } catch {
        Logger.error('You need to give a Frontify instance URL');
    }
};
