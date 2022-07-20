/* (c) Copyright Frontify Ltd., all rights reserved. */

import chalk from 'chalk';
import { Headers } from 'node-fetch';
import { HttpClient } from './httpClient';
import Logger from './logger';
import { Configuration } from './configuration';

export interface UserInfo {
    name: string;
    email: string;
}

export const getUser = async (instanceUrl: string): Promise<UserInfo | undefined> => {
    const httpClient = new HttpClient(instanceUrl);

    const accessToken = Configuration.get('tokens.access_token');
    const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

    try {
        const user = await httpClient.post<{ data: { currentUser: UserInfo } }>(
            '/graphql',
            { query: '{ currentUser { email name } }' },
            { headers }
        );
        return user.data.currentUser;
    } catch {
        Logger.error(`You are not logged in, you can use the command ${chalk.bold('frontify-cli login')}.`);
        return undefined;
    }
};
