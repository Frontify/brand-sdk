/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SinonStubbedInstance, stub } from 'sinon';

import { AppBridgePlatformApp } from '../AppBridgePlatformApp';

export type getAppBridgePlatformAppStubProps = {
    //
};

export const getAppBridgePlatformAppStub =
    ({}: getAppBridgePlatformAppStubProps = {}): SinonStubbedInstance<AppBridgePlatformApp> => {
        return {
            api: stub<Parameters<AppBridgePlatformApp['api']>>().resolves(),
            state: stub<Parameters<AppBridgePlatformApp['state']>>().resolves(),
            context: stub<Parameters<AppBridgePlatformApp['context']>>().resolves(),
            subscribe: stub<Parameters<AppBridgePlatformApp['subscribe']>>().resolves(),
            dispatch: stub<Parameters<AppBridgePlatformApp['dispatch']>>().resolves(),
        };
    };
