/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Plugin, type ResolvedConfig, esmExternalRequirePlugin } from 'vite';

export const REACT_MODULES = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom', 'react-dom/client'];

/**
 * Keeps bare `import X from 'react'` specifiers in the browser output so the
 * host page's import map resolves them at runtime instead of Vite pre-bundling
 * them into a CJS-wrapped chunk.
 */
export function reactBareExternalPlugin(): Plugin {
    const resolved = new Set<string>();
    const modules = [...REACT_MODULES] as string[];

    return {
        name: 'vite-plugin-react-bare-external',
        enforce: 'pre',
        apply: 'serve',

        config(config) {
            config.optimizeDeps ??= {};
            config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude ?? []), ...modules];

            const optimizeDepsAny = config.optimizeDeps as any;
            optimizeDepsAny.rolldownOptions ??= {};
            optimizeDepsAny.rolldownOptions.plugins ??= [];
            optimizeDepsAny.rolldownOptions.plugins.push({
                name: 'externalize-react',
                resolveId(source: string) {
                    if (modules.includes(source)) {
                        resolved.add(source);
                        return { id: source, external: true };
                    }
                    return null;
                },
            });
            optimizeDepsAny.rolldownOptions.plugins.push(esmExternalRequirePlugin({ external: modules }));

            return null;
        },

        configResolved(resolvedConfig: ResolvedConfig) {
            const base = resolvedConfig.base ?? '/';
            const escapedBase = base.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error plugins is readonly but must be extended post-resolution
            resolvedConfig.plugins.push({
                name: 'vite-plugin-react-bare-restore',
                transform(code: string) {
                    if (resolved.size === 0) {
                        return null;
                    }
                    const regex = new RegExp(`${escapedBase}@id\\/(${[...resolved].join('|')})`, 'g');
                    return code.replace(regex, (_, mod: string) => mod);
                },
            });
        },

        resolveId(id) {
            if (modules.includes(id)) {
                resolved.add(id);
                return { id, external: true };
            }
            return null;
        },

        load(id) {
            if (resolved.has(id)) {
                return 'export default {};';
            }
            return null;
        },
    };
}
