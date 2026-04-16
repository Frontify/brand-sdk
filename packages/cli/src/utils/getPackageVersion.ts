/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';
import { findPackageJSON } from 'node:module';
import { join } from 'node:path';

const getInstalledPackageVersion = (rootPath: string, packageName: string): string | undefined => {
    try {
        const pkgJsonPath = findPackageJSON(packageName, join(rootPath, 'package.json'));

        if (pkgJsonPath === undefined) {
            throw new Error(`Package "${packageName}" not found from "${rootPath}"`);
        }

        const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as { version?: string };

        return pkg.version;
    } catch {
        try {
            const pkgContent = readFileSync(join(rootPath, 'package.json'), 'utf-8');
            const pkg = JSON.parse(pkgContent) as Record<string, Record<string, string> | undefined>;

            return (
                pkg.dependencies?.[packageName] ||
                pkg.devDependencies?.[packageName] ||
                pkg.peerDependencies?.[packageName]
            );
        } catch {
            return undefined;
        }
    }
};

export const getAppBridgeVersion = (rootPath: string): string | undefined => {
    return getInstalledPackageVersion(rootPath, '@frontify/app-bridge');
};

export const getAppBridgeThemeVersion = (rootPath: string): string | undefined => {
    return getInstalledPackageVersion(rootPath, '@frontify/app-bridge-theme');
};

export const getReactVersion = (rootPath: string): string | undefined => {
    return getInstalledPackageVersion(rootPath, 'react');
};
