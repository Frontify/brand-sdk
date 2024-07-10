/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type ApiVerb } from '../registries/verbs';

type NameContextList = 'API Method';
type WrongNamePattern<ApiMethodName, NameContext extends NameContextList> = ApiMethodName extends string
    ? `The following ${NameContext} do not match the naming pattern: ${ApiMethodName}`
    : never;

type ObjectNameValidator<
    NameObject,
    PatternObject,
    NameContext extends NameContextList,
> = keyof NameObject extends keyof PatternObject
    ? NameObject
    : WrongNamePattern<
          `${Exclude<Extract<keyof NameObject, string>, Extract<keyof PatternObject, string>>}`,
          NameContext
      >;

type ApiMethodNamePattern = { [apiMethod: `${ApiVerb}${string}`]: { payload: unknown; response: unknown } };

export type PlatformAppApiMethodNameValidator<ApiMethodNameObject> = Simplify<
    ObjectNameValidator<ApiMethodNameObject, ApiMethodNamePattern, 'API Method'>
>;
