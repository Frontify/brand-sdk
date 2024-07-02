/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';

import { type PackageJson } from './npm';
import { reactiveJson } from './reactiveJson';

export const getAppBridgeThemeVersion = (rootPath: string) => {
    const packageJson = reactiveJson<PackageJson>(join(rootPath, 'package.json'));
    return packageJson.dependencies['@frontify/app-bridge-theme'];
};
