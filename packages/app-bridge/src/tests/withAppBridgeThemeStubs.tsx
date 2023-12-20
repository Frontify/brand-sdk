/* (c) Copyright Frontify Ltd., all rights reserved. */

import React, { type ComponentType } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';

import { getAppBridgeThemeStub, type getAppBridgeThemeStubProps } from './AppBridgeThemeStub';

type withAppBridgeThemeStubsProps = { appBridge: AppBridgeTheme };

export function withAppBridgeThemeStubs<T>(
    WrappedComponent: ComponentType<T>,
    appBridgeProps?: getAppBridgeThemeStubProps,
): [ComponentType<Omit<T, keyof withAppBridgeThemeStubsProps>>, ReturnType<typeof getAppBridgeThemeStub>] {
    const appBridge = getAppBridgeThemeStub(appBridgeProps ?? {});
    const ComponentWithAppBridgeStubs = (props: Omit<T, keyof withAppBridgeThemeStubsProps>) => {
        return <WrappedComponent appBridge={appBridge} {...(props as T)} />;
    };

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithAppBridgeStubs.displayName = `withAppBridgeThemeStubs(${displayName})`;

    return [ComponentWithAppBridgeStubs, appBridge];
}
