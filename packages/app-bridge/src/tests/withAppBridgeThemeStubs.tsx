/* (c) Copyright Frontify Ltd., all rights reserved. */

import React, { ComponentType } from 'react';
import { SinonStubbedInstance } from 'sinon';
import { AppBridgeBlock } from '../AppBridgeBlock';
import { AppBridgeTheme } from '../AppBridgeTheme';
import { getAppBridgeThemeStub, getAppBridgeThemeStubProps } from './AppBridgeThemeStub';

type withAppBridgeThemeStubsProps = { appBridge: AppBridgeBlock };

export function withAppBridgeThemeStubs<T>(
    WrappedComponent: ComponentType<T>,
    appBridgeProps?: getAppBridgeThemeStubProps,
): [ComponentType<Omit<T, keyof withAppBridgeThemeStubsProps>>, SinonStubbedInstance<AppBridgeTheme>] {
    const appBridge = getAppBridgeThemeStub(appBridgeProps ?? {});
    const ComponentWithAppBridgeStubs = (props: Omit<T, keyof withAppBridgeThemeStubsProps>) => {
        return <WrappedComponent appBridge={appBridge} {...(props as T)} />;
    };

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithAppBridgeStubs.displayName = `withAppBridgeThemeStubs(${displayName})`;

    return [ComponentWithAppBridgeStubs, appBridge];
}
