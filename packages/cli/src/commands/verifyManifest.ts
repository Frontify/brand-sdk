/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';

import { type HttpClientError } from '../errors/HttpClientError';
import { HttpClient, Logger, reactiveJson } from '../utils/index';
import { verifyManifestOnServer } from '../utils/verifyManifest';

import { type AppManifest, resolveCredentials } from './deploy';

type VerifyManifestOptions = {
    appType?: string;
    instance?: string;
    token?: string;
};

export const verifyManifest = async ({ appType, instance, token }: VerifyManifestOptions): Promise<void> => {
    try {
        const { instanceUrl, accessToken } = resolveCredentials(token, instance);

        const projectPath = process.cwd();
        const manifestContent = reactiveJson<AppManifest>(join(projectPath, 'manifest.json'));
        const resolvedAppType = appType || manifestContent.appType || 'content-block';

        const httpClient = new HttpClient(instanceUrl);

        Logger.info('Verifying the manifest...');

        try {
            const result = await verifyManifestOnServer(
                httpClient,
                accessToken,
                resolvedAppType,
                manifestContent as unknown as Record<string, unknown>,
            );

            if (result.data.valid) {
                Logger.success('The manifest is valid.');
                return;
            }

            Logger.error('The manifest is invalid:', result.error);
            process.exit(-1);
        } catch (error) {
            Logger.error(
                'An error occurred while verifying the manifest:',
                (error as HttpClientError).responseBody?.error || (error as Error).message,
            );
            process.exit(-1);
        }
    } catch (error) {
        if (typeof error === 'string') {
            Logger.error('The manifest verification has failed due to an error:', error);
        } else if (error instanceof Error) {
            Logger.error('The manifest verification has failed due to an error:', error.message);
        } else {
            Logger.error('The manifest verification has failed due to an unknown error.');
        }
        process.exit(-1);
    }
};
