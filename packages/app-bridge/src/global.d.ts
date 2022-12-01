/* (c) Copyright Frontify Ltd., all rights reserved. */

type Nullable<T> = T | null;

type PickRequired<Type, Key extends keyof Type> = Type & Required<Pick<Type, Key>>;
