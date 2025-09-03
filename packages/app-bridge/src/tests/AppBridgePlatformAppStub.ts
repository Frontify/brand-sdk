/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type SinonStubbedInstance, stub } from 'sinon';

import { type IAppBridgePlatformApp } from '../AppBridgePlatformApp';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type getAppBridgePlatformAppStubProps = {
    //
};

export const getAppBridgePlatformAppStub = (): SinonStubbedInstance<IAppBridgePlatformApp> => {
    return {
        api: stub<Parameters<IAppBridgePlatformApp['api']>>().resolves(),
        state: stub<Parameters<IAppBridgePlatformApp['state']>>().resolves(),
        context: stub<Parameters<IAppBridgePlatformApp['context']>>().resolves(),
        subscribe: stub<Parameters<IAppBridgePlatformApp['subscribe']>>().resolves(),
        dispatch: stub<Parameters<IAppBridgePlatformApp['dispatch']>>().resolves(),
    };
};
