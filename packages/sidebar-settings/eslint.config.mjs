/* (c) Copyright Frontify Ltd., all rights reserved. */

// @ts-check

// @ts-expect-error No types available
import frontifyConfig from '@frontify/eslint-config-basic';
// @ts-expect-error No types available
import noticePlugin from 'eslint-plugin-notice';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/', 'coverage/', 'node_modules/', '**/*.md/**.ts'],
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    frontifyConfig,
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.cjs'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            notice: noticePlugin,
        },
        rules: {
            // Copyright header rules
            'notice/notice': [
                'error',
                {
                    template: '/* (c) Copyright Frontify Ltd., all rights reserved. */\n\n',
                    messages: {
                        whenFailedToMatch: 'No Frontify copyright header set.',
                    },
                },
            ],
        },
    },
);
