/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';
import { reactiveJson } from './reactiveJson.js';
import { PackageJson } from './npm.js';

export const getAppBridgeVersion = (rootPath: string) => {
    const packageJson = reactiveJson<PackageJson>(join(rootPath, 'package.json'));
    return getMajorVersion(packageJson.dependencies['@frontify/app-bridge']);
};

export const getMajorVersion = (version: string) => {
    const match = /^\W*(\d+)/.exec(version);
    return match ? parseInt(match[1], 10) : 0;
};
