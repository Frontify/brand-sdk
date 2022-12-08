/* (c) Copyright Frontify Ltd., all rights reserved. */

// import { RequireExactlyOne } from 'type-fest';

type Nullable<T> = T | null;

// type RequireOnlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = Partial<ObjectType> &
//     RequireExactlyOne<ObjectType, KeysType>;

type RequireOnlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = {
    [Key in KeysType]: Required<Pick<ObjectType, Key>> & Partial<Record<Exclude<KeysType, Key>, never>>;
}[KeysType] &
    Partial<Omit<ObjectType, KeysType>>;
