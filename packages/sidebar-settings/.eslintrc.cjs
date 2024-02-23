/* (c) Copyright Frontify Ltd., all rights reserved. */

module.exports = {
    extends: ['@frontify/eslint-config-basic'],
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
            files: ['**/*.md/**/*'],
            processor: 'markdown/markdown',
            parserOptions: {
                project: null,
            },
        },
        {
            files: ['**/*.json'],
            parser: 'jsonc-eslint-parser',
            parserOptions: {
                project: null,
            },
        },
    ],
};
