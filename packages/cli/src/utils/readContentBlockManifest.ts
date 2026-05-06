/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Logger } from './logger';
import { type ContentBlockManifest } from './verifyManifest';

export const readContentBlockManifest = (projectPath: string): ContentBlockManifest | undefined => {
    try {
        return JSON.parse(readFileSync(join(projectPath, 'manifest.json'), 'utf8')) as ContentBlockManifest;
    } catch (error) {
        Logger.error('Warning: could not read manifest.json from project root.', (error as Error).message);
        return undefined;
    }
};
