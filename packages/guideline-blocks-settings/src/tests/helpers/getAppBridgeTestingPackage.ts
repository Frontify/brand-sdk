/* (c) Copyright Frontify Ltd., all rights reserved. */

// TODO: Remove when app-bridge v3 peer deps is gone
/* eslint-disable @typescript-eslint/ban-ts-comment */

import packageJson from '../../../node_modules/@frontify/app-bridge/package.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GetMajorVersion<T extends string> = T extends `${infer Major}.${infer _}` ? Major : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GetMinorVersion<T extends string> = T extends `${infer _}.${infer Minor}.${infer _}` ? Minor : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GetPatchVersion<T extends string> = T extends `${infer _}.${infer _}.${infer Patch}` ? Patch : never;

// @ts-ignore will fail if <=v3.0.4 is installed
type TypedPackageJson = typeof import('../../../node_modules/@frontify/app-bridge/package.json.d.ts');

const appBridgeVersion = packageJson.version as 0 extends 1 & TypedPackageJson['version']
    ? '3.0.0'
    : TypedPackageJson['version'];

type AppBridgeMajorVersion = GetMajorVersion<typeof appBridgeVersion>;
type AppBridgeMinorVersion = GetMinorVersion<typeof appBridgeVersion>;
type AppBridgePatchVersion = GetPatchVersion<typeof appBridgeVersion>;

export const getAppBridgeTestingPackage = async (): AppBridgeMajorVersion extends '3'
    ? AppBridgeMinorVersion extends '0'
        ? AppBridgePatchVersion extends '0' | '1' | '2' | '3' | '4'
            ? Promise<typeof import('@frontify/app-bridge')>
            : // @ts-ignore will fail if <=v3.0.4 is installed
              Promise<typeof import('@frontify/app-bridge/testing')>
        : // @ts-ignore will fail if <=v3.0.4 is installed
          Promise<typeof import('@frontify/app-bridge/testing')>
    : // @ts-ignore will fail if <=v3.0.4 is installed
      Promise<typeof import('@frontify/app-bridge/testing')> => {
    const isAppBridgeVersionWithTestingExport =
        appBridgeVersion.startsWith('3.0.') && ['0', '1', '2', '3'].includes(appBridgeVersion.split('.')[2]);

    if (isAppBridgeVersionWithTestingExport) {
        const appBridgePackage = await import('@frontify/app-bridge');

        // @ts-ignore will fail if >3.0.4 is installed
        return appBridgePackage as typeof import('@frontify/app-bridge');
    }

    // Needed if <=v3.0.4 is installed as it doesn't have the /testing export
    const getPath = () => '@frontify/app-bridge/testing';
    // @ts-ignore will fail if <=v3.0.4 is installed
    const appBridgeTestingPackage = await import(
        isAppBridgeVersionWithTestingExport ? getPath() : '@frontify/app-bridge/testing'
    );

    // @ts-ignore will fail if <=v3.0.4 is installed
    return appBridgeTestingPackage as typeof import('@frontify/app-bridge/testing');
};
