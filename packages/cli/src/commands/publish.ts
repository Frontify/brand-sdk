/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';

import pc from 'picocolors';

import { type HttpClientError } from '../errors/HttpClientError';
import { Configuration, HttpClient, Logger, type UserInfo, getUser, reactiveJson } from '../utils/index';
import { type MarketplaceManifest } from '../utils/verifyManifest';

export enum Availability {
    PRIVATE = 'PRIVATE',
    COMMUNITY = 'COMMUNITY',
}

type PublishOptions = {
    releaseNotes: string;
    availability?: Availability;
    token?: string;
    instance?: string;
};

export const publishApp = async ({
    releaseNotes,
    availability = Availability.PRIVATE,
    token,
    instance,
}: PublishOptions): Promise<void> => {
    try {
        const instanceUrl = instance || Configuration.get('instanceUrl');
        const accessToken = token || Configuration.get('tokens.access_token');

        if (!accessToken || !instanceUrl) {
            Logger.error(
                `You are currently not logged in. You can use the command ${pc.bold(
                    'frontify-cli login',
                )} to log in, or pass --token=<token> --instance=<instance> to the publish command.`,
            );
            process.exit(-1);
        }

        const user: UserInfo | undefined = await getUser(instanceUrl, token);
        if (!user) {
            process.exit(-1);
        }

        Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);

        const projectPath = process.cwd();
        const manifestContent = reactiveJson<MarketplaceManifest>(join(projectPath, 'manifest.json'));
        const { appId } = manifestContent;

        const httpClient = new HttpClient(instanceUrl);

        const query = `mutation PublishMarketplaceApp {
  publishMarketplaceApp(
    input: {appId: "${appId}", releaseNotes: ${JSON.stringify(releaseNotes)}, availability: ${availability}}
  ) {
    id
  }
}`;

        Logger.info('Publishing the app to the Frontify Marketplace...');

        try {
            await httpClient.post<{ data: { publishMarketplaceApp: { id: string } } }>(
                '/graphql',
                { query },
                { headers: { Authorization: `Bearer ${accessToken}` } },
            );

            Logger.success('The app has been published successfully.');
        } catch (error) {
            Logger.error('An error occurred while publishing:', (error as HttpClientError).responseBody.error);
            process.exit(-1);
        }
    } catch (error) {
        if (typeof error === 'string') {
            Logger.error('The publishing has failed and was aborted due to an error:', error);
        } else if (error instanceof Error) {
            Logger.error('The publishing has failed and was aborted due to an error:', error.message);
        } else {
            Logger.error('The publishing has failed and was aborted due to an unknown error.');
        }
        process.exit(-1);
    }
};
