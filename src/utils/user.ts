import { bold } from "chalk";
import { Headers } from "node-fetch";
import { HttpClient } from "./httpClient";
import Logger from "./logger";
import { Configuration } from "./configuration";

export interface UserInfo {
    name: string;
    email: string;
}

export const getUser = async (instanceUrl: string): Promise<UserInfo | undefined> => {
    const httpClient = new HttpClient(instanceUrl);

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
