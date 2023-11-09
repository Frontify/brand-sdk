/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';
import { reactiveJson } from './reactiveJson.js';
import { PackageJson } from './npm.js';

export const getAppBridgeVersion = (rootPath: string) => {
    const packageJson = reactiveJson<PackageJson>(join(rootPath, 'package.json'));
    return packageJson.dependencies['@frontify/app-bridge'];
};
