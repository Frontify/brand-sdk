/* (c) Copyright Frontify Ltd., all rights reserved. */

type Nullable<T> = T | null;

/**
Type that behaves just like RequiredExactlyOne from type-fest with only difference that the remaining keys are set to optional.

@category Object
*/
type RequireOnlyOne<ObjectType, KeysType extends keyof ObjectType = keyof ObjectType> = {
    [Key in KeysType]: Required<Pick<ObjectType, Key>> & Partial<Record<Exclude<KeysType, Key>, never>>;
}[KeysType] &
    Partial<Omit<ObjectType, KeysType>>;

type PickRequired<Type, Key extends keyof Type> = Type & Required<Pick<Type, Key>>;
