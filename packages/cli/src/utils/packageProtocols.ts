/* (c) Copyright Frontify Ltd., all rights reserved. */

/**
 * Package manager protocol prefixes used in dependency specifiers
 * (e.g. `workspace:*`, `catalog:react`, `link:../foo`).
 *
 * These are not valid semver ranges and must be resolved before deployment.
 */
export const PACKAGE_PROTOCOL_PREFIXES = ['catalog:', 'workspace:', 'link:', 'file:', 'portal:'] as const;

export const isPackageProtocolSpecifier = (specifier: string): boolean => {
    return PACKAGE_PROTOCOL_PREFIXES.some((prefix) => specifier.startsWith(prefix));
};
