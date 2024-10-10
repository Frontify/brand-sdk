/* (c) Copyright Frontify Ltd., all rights reserved. */

module.exports = {
    root: true,
    extends: ['@frontify/eslint-config-react'],
    plugins: ['notice'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    overrides: [
        {
            files: ['*.js', '*.ts', '*.tsx'],
            rules: {
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
        {
            files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
            rules: {
                '@typescript-eslint/no-redundant-type-constituents': 'off',
                'no-prototype-builtins': 'warn',
                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/no-misused-promises': 'warn',
                '@typescript-eslint/no-unsafe-argument': 'warn',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/require-await': 'warn',
                '@typescript-eslint/await-thenable': 'warn',
                '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
                '@typescript-eslint/restrict-plus-operands': 'warn',
            },
        },
        {
            files: ['**/*.md/**/*'],
            processor: 'markdown/markdown',
            parserOptions: {
                project: null,
            },
        },
    ],
};
