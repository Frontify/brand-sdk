/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'path';
import { reactiveJson } from './reactiveJson';

export const updatePackageJsonProjectName = (folderPath: string): void => {
    const packageJsonPath = resolve(folderPath, 'package.json');
    const packageJson = reactiveJson<PackageJson>(packageJsonPath);
    packageJson.name = folderPath;
};
