import { bold } from "chalk";
import { Headers } from "node-fetch";
import { HttpClient } from "./httpClient";
import Logger from "./logger";
import { Configuration } from "./store";

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

export interface UserInfo {
    name: string;
    email: string;
}

//TODO: better handling of baseUrl
let baseUrl: string;
switch (process.env.NODE_ENV) {
    case "development":
        baseUrl = "https://dev.frontify.test";
        break;
    case "production":
        baseUrl = "https://dev.frontify.test";
        break;
    case "test":
        baseUrl = "https://test.frontify.com";
        break;
    default:
        baseUrl = "https://dev.frontify.test";
        break;
}

const httpClient = new HttpClient(baseUrl);

export const getRandomCodeChallenge = async (): Promise<OauthRandomCodeChallenge> => {
    try {
        const randomCodeChallenge = await httpClient.get<{ data: OauthRandomCodeChallenge }>("/api/oauth/random");
        return randomCodeChallenge.data;
    } catch {
        throw new Error("An error occured while getting the random challenge.");
    }
};

export const getLoginUrl = (sha256: string): string => {
    const queryParams = [
        "response_type=code",
        "client_id=block-cli",
        "redirect_uri=http://localhost:5600/oauth",
        "scope=basic:read%2Bblocks:read%2Bblocks:write",
        `code_challenge=${sha256}`,
        "code_challenge_method=S256",
    ].join("&");

    return `${baseUrl}/api/oauth/authorize?${queryParams}`;
};

export const getOauthCredentialDetails = async (
    randomChallengeSecret: string,
    authorizationCode: string,
): Promise<OauthAccessTokenApiResponse> => {
    const headers = new Headers({
        "Content-Type": "application/json",
    });

    try {
        const tokens = await httpClient.post<OauthAccessTokenApiResponse>(
            "/api/oauth/accesstoken",
            {
                grant_type: "authorization_code",
                client_id: "block-cli",
                redirect_uri: "http://localhost:5600/oauth",
                scope: "basic:read%2Bblocks:read%2Bblocks:write",
                code_verifier: randomChallengeSecret,
                code: authorizationCode,
            },
            {
                headers,
            },
        );

        return tokens;
    } catch (error) {
        throw new Error(`An error occured while getting tokens: ${error.message}`);
    }
};

export const getUser = async (): Promise<UserInfo | undefined> => {
    const accessToken = Configuration.get("tokens.access_token");
    const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

    try {
        const user = await httpClient.post<{ data: { current_user: UserInfo } }>(
            "/graphql",
            { query: "{ current_user { email avatar name } }" },
            { headers },
        );
        return user.data.current_user;
    } catch {
        Logger.error(`You are not logged in, you can use the command ${bold("frontify-block-cli login")}.`);
        return undefined;
    }
};
