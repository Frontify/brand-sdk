/* (c) Copyright Frontify Ltd., all rights reserved. */

export type PlatformAppMethods = {
    currentUser: [{ name: 'currentUser' }, { id: string; name?: string | null; email: string; avatar: string }];
};

export type MethodsListKeys = keyof PlatformAppMethods;
export type MethodsListPayloadType<MethodName extends MethodsListKeys> = PlatformAppMethods[MethodName][0] extends {
    payload: infer P;
}
    ? P
    : void;
export type MethodsListReturnType<MethodName extends MethodsListKeys> = Promise<PlatformAppMethods[MethodName][1]>;
export type MethodsListType = {
    [Method in MethodsListKeys]: (payload: MethodsListPayloadType<Method>) => MethodsListReturnType<Method>;
};
