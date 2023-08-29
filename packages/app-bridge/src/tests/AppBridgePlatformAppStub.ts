/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SinonStubbedInstance, stub } from 'sinon';

import { IAppBridgePlatformApp } from '../AppBridgePlatformApp';

export type getAppBridgePlatformAppStubProps = {
    //
};

export const getAppBridgePlatformAppStub =
    ({}: getAppBridgePlatformAppStubProps = {}): SinonStubbedInstance<IAppBridgePlatformApp> => {
        return {
            api: stub<Parameters<IAppBridgePlatformApp['api']>>().resolves(),
            state: stub<Parameters<IAppBridgePlatformApp['state']>>().resolves(),
            context: stub<Parameters<IAppBridgePlatformApp['context']>>().resolves(),
            subscribe: stub<Parameters<IAppBridgePlatformApp['subscribe']>>().resolves(),
            dispatch: stub<Parameters<IAppBridgePlatformApp['dispatch']>>().resolves(),
        };
    };
